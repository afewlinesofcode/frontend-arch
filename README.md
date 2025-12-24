# Bare-metal frontend

## Introduction

Modern frontend applications have become very rich, complex and sophisticated. They are not just simple UIs polling data. They have complex business logic, various flows, real-time updates, offline support, caching, and so on. All this complexity needs to be managed and organized properly to keep the code maintainable, testable, and extensible.

There are many ways to architect and develop such applications.
Also today there are a number of libraries that help with organizing different flows, state management, side effects handling, data fetching, caching, etc.
Often times applications become very dependent of these libraries, and testing features becomes complicated because business logic and UI become intertwined, not easy to mock dependencies or even have to add another library to do it, UI dictates how the business logic should flow, even worse the business logic becomes just a side effect of UI.

I'm very happy if you don't have these issues and your structure is well thought from the beginning with clear separation of concerns, but I'm sure there are still plenty of developers who face these challenges, and I hope this article will help get more insights in future projects.

Describing a problem. You participate in React project which has grown into something big, and you're spending significant amount of time understanding how various things happen, you find yourself tangled in a web of prop drilling, state management complexities, component re-renders, while all this is tightly connected with business logic processing. You see a button, this button has a hook, the hook dispatches an action, that action updates some state, the state change triggers another action to trigger a side effect, it fetches some data, that data updates some other state, and so on. And when you need to add a new feature, it turns out that adding a test for it is even more complicated than implementing the feature itself. Then you have to include a whole libraries for trivial things like caching of requests, orchestrating flows, mocking/intercepting the added libraries. And I want to point out that we're still talking about making the project work, not about adding a value to the product.
So how to avoid this in the future or maybe try to improve the existing projects?

The key problem here is how we treat React in general. For some reason many developers consider React as a framework for building applications, and the project development starts with React components because we naturally want to see results as soon as possible, then extending their behaviour and adding business logic inside hooks, then in actions, sagas, queries, you name it. The funny thing is that if you open [React](https://react.dev/) home page, you'll find how React identifies itself:

> The library for web and native user interfaces

It's a library. Thus, it should only be used as a tool, and not be a central piece of the application.

We just need to change the perspective.
There is an application doing business logic in the center, and there is UI that can be implemented with React, Vue, plain JS, or anything else. The UI is just a way to present the application state and capabilities to the user and get user input to trigger these capabilities.

I think it should be much easier to describe my thinkings with a practical example. We'll build a simple but not trivial application with React UI. I should confess that while preparing it for the article I started with business logic, not sure if this is because of my backend background, but then I realized that most of frontend developers most likely would start with UI. So let's try to do the same while maintaining the same perspective. Of course, the approach we're going to discuss here doesn't actually match the complexity of the task, this is demo after all, at the same time even small applications may grow into something huge.

## Input

Let's say we have the following requirements for our application:

A simple travel app where users can search for travel options, view travel details, and purchase travels. A travel option includes information about departure and destination locations, departure date, travel class, price, airline.

Once a user opens the app, they see a Home page. On the Home page they see a form to set up travel preferences (from location, to location, travel classes), a list of previously searched preferences (if any), a list of last minute deals (if any).

Clicking a recent search preference triggers a search with those criteria. Once the user submits the form, they see a list of travel cards (under last minute deals) with information about each travel option. The search form is visible on every page to refine the search.

Each card has a button to purchase a travel. When the user clicks on the purchase button, if they are not signed in, they see a Sign In pop-up. After signing in they need to click purchase again. After purchasing, they can see the travel on the Profile page, and a congratulatory message shows up. The purchased travel can have a name, and the user can change it.

On every page there is a header with a home button, a sign in or profile button.

Also, if a new last minute deal appears in the system, a notification shows up with a link to the Home page with last minute deals list.

## UI

### Analysis

Now let's think about how to structure it, starting with UI.

From the description we can identify there are two pages:

- **Home page** - contains the following containers:
  - **Recent searches list** - to show previously searched preferences
  - **Last minute deals list** - to show last minute deals
  - **Travel cards list** - to show search results
- **Profile page** - contains the following containers:
  - **User info** - to show user information
  - **Purchased travels list** - to show travels purchased by the user

Also there are several modals:

- **Sign In modal** - to login or register
- **Purchase congratulation modal** - to show a success message after purchase
- **Rename travel modal** - to rename a purchased travel on the profile page

And finally there is one more dynamic element:

- **Notification pop-up** - to notify the user about events and errors

The UI will need at least one layout and since it is allowed to search travels regardless of authentication status, and search form is visible on every page, we can have only one layout:

- **Session layout** - contains the following containers:
  - **Header** - header with title and action links
  - **Search form** - to set up travel preferences

These are the UI components that deliver the required experience.

Then we need to think about what data and actions the UI will need from the application to maintain this experience.

From reading the description again, we have the following entities to work with:

- **Session** - represents the user session, contains user information and probably other session related data
- **Travel card** - represents a travel option with all its details
- **Search criteria** - represents the search preferences set by the user
- **Last minute deal** - represents a last minute deal option
- **Purchased travel** - represents a travel that the user has purchased

The UI expects to be supplied with hooks to get these entities.

And here's the list of actions that we can identify at this stage:

- **Login** - to log the user in
- **Register** - to register a new user
- **Search travels** - to search for travel options based on criteria
- **Get last minute deals** - to get current last minute deals existing in the system
- **Get new last minute deals** - to get new last minute deals which are not shown yet
- **Get recent searches** - to get the list of recent search criteria
- **Purchase travel** - to purchase a travel option
- **Purchase last minute deal** - to purchase a last minute deal
- **Rename purchased travel** - to rename a purchased travel option

Nice. We can add more later. Now as we have the overall picture of the UI, we can move on to implementation.

### Implementation

First of all, please find the code repository here: https://github.com/afewlinesofcode/frontend-app/

And use it as a reference while reading the article. I didn't want to bloat the article with many code snippets, so I'll try to just describe what I've done in each step, and you can check the code in the repository.

For this project we decided to use [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) and [Mantine UI](https://ui.mantine.dev/) library for components and styling.

Let's use [Vite](https://vite.dev/) this time to create a React + TypeScript project. Then install Mantine UI library and other required dependencies. In the `src/` folder create `ui/` folder for UI components and `app/` folder for future business logic application.

My strategy is the following. First, I define the contracts specifying which objects I'm going to work with and how I can get them. Second, I define application React context that will provide means to access these contracts and to connect with the application to access its API. And then I can create all necesary UI components.

Now starting implementation.

#### Contracts

First I want to define UI expectations in `ui/contracts/` folder. The application will have to comply these expectations. TypeScript is not strictly typed like C++ or Java so we'll leverage from using it as a plug and a socket (interfaces with same shape are compatible).

For the entites I do it in two files: `auth.ts` and `travel.ts`. Why? Let's take a look at our entities and actions in the _Analysis_ stage again. We can find that they can be split into two main contexts (or two bounded contexts if speaking DDD terms): Auth context and Travel context. So let's break it for better maintainability.

Entity types defined in `auth.ts`:

- `Session` - contains name and email of the user
- `AuthStatus` - contains loading state for authentication actions

Entity types defined in `travel.ts`:

- `TravelCard` - contains id, from and to locations, departure date, price, airline, travel class
- `SearchCriteria` - contains from, to, and travel class
- `LastMinuteDeal` - contains same fields as in travel card as a denormalized view, plus id of the travel card this deal is related to, and description
- `PurchasedTravel` - contains same fields as in travel card, plus id of the related travel, purchased date, and configurable name
- `TravelStatus` - contains loading states for travel related actions

Please check these structs in the repository.

#### Application context

In the `ui/contracts/app.ts` file I define interface for application's React context `AppContext<Api>` that will provide all necessary hooks to get entities per bounded context as well as the `api` reference that will provide the API to push the flow forward.

```ts
interface AuthHooksContext {
  useSession: () => Session | null
  useStatus: (key: keyof AuthStatus) => AuthStatus[typeof key]
}

interface TravelHooksContext {
  useSearchCriteria: () => SearchCriteria | null
  useTravelCards: () => TravelCard[]
  usePurchasedTravels: () => PurchasedTravel[]
  useRecentSearches: () => SearchCriteria[]
  useLastMinuteDeals: () => LastMinuteDeal[]
  useStatus: (key: keyof TravelStatus) => TravelStatus[typeof key]
}

export interface AppContext<Api> {
  api: Api
  auth: AuthHooksContext
  travel: TravelHooksContext
}
```

You've probably noticed that I've used generic `Api` type here. The idea is that there's no application at this stage. So while working on UI we can have some demo application implementation not necessarily with the same API as will be in the real application (however it's better to define it to avoid the necessity to adjust API calls later), but enough to provide the required UI experience (like adding a travel card, triggering last minute deal appearance). Also I want to point out that having an application context wrapping all UI components is totally safe because all props in it are stable references, so no re-renders will be triggered because of context value changes.

We have entities representing data structures to work with and hooks providing these data structures. It is time to create React context to provide all this to components. Let's do it in `ui/context/app.ts` file. And if you've checked it already in the repository, you can notice that I also implemented a very simple demo application to use while working on the UI. Let's take a look at it.

#### Demo application

`ui/context/demo/app.ts` file provides composition root for the demo application with `api` property providing `auth` and `travel` contexts' APIs, and `react` property providing hooks from these contexts.

```ts
{
    api: {
      auth: auth.app,
      travel: travel.app,
    },
    react: {
      auth: auth.react,
      travel: travel.react,
    },
  }
```

For example, let's analyze `demo/auth.ts` file.
I didn't want to add any event management or state management libraries, so created a primitive helper in `demo/reactive.ts` that would allow getting reactions on value changes that I can use in hooks. Having it, I've just defined auth state object variable like this:

```ts
const state = {
  session: new Reactive(null as Session | null),
  authStatus: new Reactive({ isLoading: false } as AuthStatus),
}
```

Now `state.session.value` would return the session value, and by calling `state.session.subscribe(callback)` I can get notified when the session value gets changed by `state.session.value = <new value>` expression. And hooks effectively use it via `useReactiveValue` helper hook defined in the same file. Now to create a session hook I just define a function:

```ts
function useSession() {
  return useReactiveValue(state.session)
}
```

And a function to perform login action:

```ts
async function login(command: { email: string; password: string }) {
  // emulate loading
  state.authStatus.value = { ...state.authStatus.value, isLoading: true }
  await sleep(1000)
  state.authStatus.value = { ...state.authStatus.value, isLoading: false }
  // set session
  state.session.value = {
    email: command.email,
    name: 'Test User',
  }
}
```

Finally, `composeAuth` combines these functions and returns `api` with an API method to log in with loading simulation and an API method to register which throws an error as handling of errors also needs to be implemented in the UI, and `react` with hooks to get current session and auth status.

Similarly, `demo/travel.ts` file implements travel context with its own state and API methods and hooks.

`demo/app.ts` composes these two contexts into one demo application.

#### Back to the context

So the context is created as:

```ts
type Api = ReturnType<typeof composeDemo>['api']
export const appContext = createContext<AppContext<Api> | null>(null)
```

And `ui/context/provider/app.tsx` file completes the application context implementation with provider component.

When the real application becomes available, we can plug it in by changing the `Api` type, and composing it in the provider, also will probably need to adjust API calls (as mentioned earlier) in the UI components, but the overall structure will remain the same.

After wrapping everything with `AppProvider` in `ui/main.tsx`, anywhere in the components tree accessing application data can be as simple as:

```ts
const { auth } = useAppContext()
const session = auth.useSession()
```

And if we need to trigger an action:

```ts
const { api } = useAppContext()

const onSearch = useCallback(
  (criteria: SearchCriteria) => {
    api.travel.searchTravels(criteria)
  },
  [api]
)
```

One nice thing that you'll appreciate in the future is the `window.api` that you can expose from the provider component. It allows you to access the application API from the browser console to manipulate the application state while working on the UI.

Seems like we have everything to start building UI components.

#### Components

Need to build a tree of UI components delivering all required experience.
Let's make a general structure to quickly overview what we're doing.

- Session layout
  - Search form
  - Links: Home, Profile/Login
- Home page
  - Recent searches list
  - Last minute deals list
  - Travel cards list
- Profile page
  - User info
  - Purchased travels list
- Dynamic elements
  - Sign In modal
  - Purchase congratulation modal
  - Rename travel modal
  - Notification pop-up

Nice.

Creating React components is not in the scope of this article, please check the repository for their implementation. Most of them are built from examples provided on [Mantine UI](https://ui.mantine.dev/) website. The main idea here is that components only use the application context to get data and trigger actions, no logic except very simple solely UI oriented like modals visibility, resetting forms, etc.

I want to draw your attention to one item that is created for UI purposes - UI context in `ui/contexts/ui.ts` file. It provides hooks to manage UI state like modals visibility, notifications, etc. It contains only UI logic, absolutely nothing that may be related to business logic. This implementation with React context isn't very efficient because it will trigger unnecessary re-renders on modal actions making context value change, but I used it for simplicity.

Let's quickly overview what we have with components. It starts in `ui/main.tsx` rendering root component with all providers and the main app component inside.

```tsx
createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <UIProvider>
      <BrowserRouter>
        <MantineProvider>
          <Notifications position="top-center" />
          <AppComponent />
        </MantineProvider>
      </BrowserRouter>
    </UIProvider>
  </AppProvider>
)
```

The App component is in `ui/containers/App.tsx` file that sets up routing per page, layout, and adds modals. Also, it calls `useLastMinuteDealsWatch()` hook that reacts on new last minute deals and shows notifications.

```tsx
export default function App() {
  useLastMinuteDealsWatch()

  return (
    <SessionLayout>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <LoginModal />
      <RenameModal />
      <CongratulationsModal />
    </SessionLayout>
  )
}
```

Every page simply renders its containers, containers use components and provide them with callbacks to trigger actions wrapped with `try/catch` to show error notifications in case of failures.

```tsx
function useSearchCallback() {
  const { api } = useAppContext()
  const { notify } = useUIContext()
  const navigate = useNavigate()

  return useCallback(
    async (criteria: SearchCriteria) => {
      try {
        await api.travel.searchTravels(criteria)
        navigate('/')
      } catch (e) {
        notify({
          color: 'red',
          title: 'Search error',
          message: (e as Error).message,
        })
      }
    },
    [app, navigate, notify]
  )
}

export default function RecentSearches() {
  const { travel } = useAppContext()
  const recentSearches = travel.useRecentSearches()
  const search = useSearchCallback()

  return (
    <div>
      {recentSearches.length > 0 && <h2>Recent Searches</h2>}
      <Grid className={classes.grid} gutter="md">
        {recentSearches.map((recentSearch, index) => (
          <Grid.Col key={index} span={{ base: 12, xs: 6, md: 3 }}>
            <RecentSearch
              value={recentSearch}
              onClick={() => search(recentSearch)}
            />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  )
}
```

As you see it just performs a usual call to `api.travel.searchTravels()` method like you can do in the browser console as well, no magic. The container with travel cards will eventually get cards via `useTravelCards` hook.

Now you can run the app with `npm run dev` command (don't forget `npm install` if not installed yet) and see the result. Open browser console and try typing `api.travel.addLastMinuteDeal()` to see how notification appears.

## Application

In a big application where a lot needs to be processed and calculated in the background and a lot of sophisticated UI needs to be delivered there can be separate developers for both parts.
They only need to agree on the contracts. And UI have already provided us with something. Very nice when application can do the same.

Ok. So now we're application developers. We have nothing to do with the UI, at this stage we don't even know what library is to be used. All we need is to provide API.

When creating application we are not limited by any library constraints and can use any architecture we want. Just remember about clear boundaries between different parts of the application. I suggest to create a DDD inspired implementation.

We have absolutely the same task description as before, and by the same logic we decide what bounded contexts we need:

- **Auth context** - to manage user authentication and session
- **Travel context** - to manage travel options, searches, purchases, and last minute deals

But since we're not going to have any backend let's also add one more context:

- **Admin context** - to manage travel data

Create `src/app/` folder for our application, and the following folders inside it:

- `contexts/` - for the mentioned bounded contexts
- `shared/` - for things shared between contexts

And I want to start with **Admin context** as it will provide data for the rest of the application.

### Admin context

Create `src/app/contexts/admin/` folder that will be home for the context.

In the new context folder immediately create the following sub-folders:

- `domain/` - to put objects and entities defining the domain
- `application/` - to put application services and use cases orchestrating workflows
- `infrastructure/` - to put infrastructure implementations and different API integrations
- `interface/` - for providing context interface API

#### Domain layer

In the admin context I decided to define the following domain objects:

- `Offer` - an entity that includes id and other travel card details
- `SpecialOffer` - an entity that includes id, special price, description, and reference to the related offer

Also I've added the following domain object classes:

- `OfferDraft` - to represent a draft of an offer to be created
- `SpecialOfferDraft` - to represent a draft of a special offer to be created

The draft classes are bases for the existing entities classes.
To create a new offer draft a factory method `OfferDraft::create(props)` is defined and for an existing offer there is `Offer::rehydrate(props)` method. Same with special offers.

`SpecialOfferDraft`:

```ts
export type SpecialOfferDraftProps = {
  offerId: string
  specialPrice: number
  description: string
}

export default class SpecialOfferDraft<
  T extends SpecialOfferDraftProps = SpecialOfferDraftProps,
> {
  protected _props: T

  public get offerId() {
    return this._props.offerId
  }

  public get specialPrice() {
    return this._props.specialPrice
  }

  public get description() {
    return this._props.description
  }
  protected constructor(props: T) {
    this._props = { ...props }
  }
  public static create(props: SpecialOfferDraftProps) {
    return new SpecialOfferDraft({ ...props })
  }
}
```

`SpecialOffer`:

```ts
export type SpecialOfferProps = SpecialOfferDraftProps & {
  id: string
}

export default class SpecialOffer extends SpecialOfferDraft<SpecialOfferProps> {
  public get id() {
    return this._props.id
  }

  public patch(props: Partial<Omit<SpecialOfferProps, 'id'>>) {
    this._props = { ...this._props, ...props }
  }

  public static rehydrate(props: SpecialOfferProps) {
    return new SpecialOffer(props)
  }
}
```

Why classes and not just interfaces? Because I want to add behaviour to these objects. They can have updaters, validators, various policies. And this way I can be sure that my domain objects are always valid and consistent.

Now as the domain is ready, we can switch to the application layer and define what our context is capable of.

#### Application layer

In the `application/services/` folder I've created two files:

- `offers-service.ts` - with `OffersService` class to manage offers
- `special-offers-service.ts` - with `SpecialOffersService` class to manage special offers

Let's take a look at `OffersService` class.

I decided to allow the following operations:

- Get all offers
- Get offer by ID
- Add a new offer
- Update an existing offer

This is why `OffersService` class provides the following methods:

```ts
class OffersService {
  public async getAll(): Promise<OfferView[]> {
    /*...*/
  }
  public async getById(id: string): Promise<OfferView | null> {
    /*...*/
  }
  public async add(command: AddOfferCommand): Promise<OfferView> {
    /*...*/
  }
  public async update(command: UpdateOfferCommand): Promise<OfferView> {
    /*...*/
  }
}
```

And to implement all these methods I need a repository to store and manage offers. So I've created a port in `application/ports/offers-repository.ts` file with `OffersRepository` interface defining methods for managing offers in a store:

```ts
export default interface OffersRepository {
  findAll(): Promise<Offer[]>
  findById(id: string): Promise<Offer | null>
  findByIds(ids: string[]): Promise<Offer[]>
  add(offer: OfferDraft): Promise<Offer>
  update(offer: Offer): Promise<Offer>
  clear(): Promise<void>
}
```

And injected this dependency into the service constructor.

```ts
export default class OffersService {
  public constructor(private offersRepository: OffersRepository) {}
  //...
}
```

Now the service can be implemented.

Actually there are many debates on where repositories should live, application or domain, but to my understanding persistence is not part of domain. I prefer to keep them in the application layer next to other ports like providers and gateways.

#### ACL

One more important element is the Anti-Corruption Layer (ACL), which acts as a protective barrier between layers.

I'm sure you've noticed `OfferView` in `OffersService`. This interface is defined in `application/acl/`. Why not simply `Offer` which is defined in the domain?
This is an example of separation of concerns. Domain layer should always stay isolated from outside world, feeling cozy and warm. `OfferView` provides an API-friendly representation of `Offer` built from simple types.

The client uses exposed API from application layer and provides instances of `OfferView` to the API, not caring about domain details, then application layer needs instances of `Offer` for domain logic and ports, and to orchestrate the flow. After some processing application layer having instances of `Offer` needs to return instances of `OfferView` back to the client. This is where ACL comes into play. It may simply convert plain view objects to domain class instances and back, also it can handle more complex processing with validations and throwing errors.

And in the application we usually have ACL for application-domain and for domain-infrastructure mapping.

#### Infrastructure layer

And again, why not just a normal class `OffersRepository` doing all the work with local storage? The answer is: because I want to decouple the business logic from storage implementation details. This way I'm free to use my `OffersService` with local storage, in-memory storage for testing, backend API based on REST or GraphQL, or anything else. And I add implementations in the infrastructure layer in `infrastructure/` folder. I've put local storage adapter in `infrastructure/local-storage/offers-repository.ts` file.

And here we find ACL too in `infrastructure/local-storage/acl/`. The only change is in the terminology as we now have DTOs (Data Transfer Objects). Need to map domain object `Offer` to a value that adapter's storage can consume - `OfferDTO`.

#### D

Another thing worth mentioning is how the local storage adapter is implemented. Although it's intended to work with concrete local storage, we still inject a generic storage interface dependency. This way it's much easier to test the class even when no local storage is available.

#### Errors

I don't like returning error codes in various flows and prefer using exceptions. I think it's the cleanest way to inform about errors, to know about errors, and to clean up after errors. Errors related to application flow are defined in `application/errors/` folder.

#### Interface

Finally, to provide the context interface API we need to create `interface/api.ts` file that will compose API from application objects that we want to expose.

#### Tests

To make sure everything works fine while working on the context implementation I created a number of tests in `tests/app/contexts/admin/` folder. Please check them and run them.

### Auth context

Now we can move to **Auth context** in `src/app/contexts/auth/` folder. Similarly create the same structure of sub-folders.

But after analyzing we find out there's no domain in this context. And this is fine because this context only relies on various gateways and providers APIs. Nothing to own.

This time I decided to implement use-cases instead of services. They are defined in `application/use-cases/` folder. They are different from services in that they are single purpose classes that perform one action only. Let's take a look at the file `restore-user.ts`.

```ts
export default class RestoreUser {
  public constructor(
    private sessionProvider: SessionProvider,
    private sessionStore: SessionStore
  ) {}

  public async execute() {
    const session = await this.sessionProvider.restore()

    if (session) {
      this.sessionStore.setSession({
        email: session.email,
        name: session.name,
      })
    } else {
      this.sessionStore.setSession(null)
    }
  }
}
```

It contains `RestoreUser` use-case class with `execute()` method only which performs the only task to restore user session. All dependencies are injected via constructor and they are all abstract. This way we again have a clear separation of concerns, and each use-case is easy to test.

Of course, `execute` method can have parameters same as methods in services, and also this is the place where all validation of input data should happen. For example, in `LoginUser` use-case:

```ts
public async execute(command: LoginUserCommand) {
    assertLoginUserCommand(command)
    // ...
}
```

Here `assertLoginUserCommand` function is used to check both `email` and `password` fields are provided and not empty.

In this context we needed to add two ports in `application/ports/` folder:

- `SessionProvider` - to save and restore sessions between reloads
- `AuthGateway` - to communicate with auth API

Also added `application/contracts/` folder to define types and commands that the context uses with external APIs. There's no need to add ACL here, nothing to isolate.

Similarly to the admin context, in the infrastructure layer we provide implementations for the defined ports.

Finally, created `interface/api.ts` file to compose the context API.

And of course tests are in `tests/app/contexts/auth/` folder.

### Travel context

Now the most interesting context in our demo - **Travel context** in `src/app/contexts/travel/` folder. Again, create the same structure of sub-folders.

This context has something to look at in the domain layer.

#### Domain layer

We have `SearchCriteria` value object. And for this object we added policies making sure the created search criteria is valid.

The base policy interface:

```ts
export default interface SearchCriteriaPolicy {
  validate(props: SearchCriteriaProps): void
}
```

and implemented `DistinctOriginDestinationPolicy` to check `from` and `to` locations are different. The policy runs when `SearchCriteria` is created:

```ts
public static create(
  props: SearchCriteriaProps,
  policy: SearchCriteriaPolicy = new DistinctOriginDestinationPolicy()
) {
  policy.validate(props)
  return new SearchCriteria({ ...props })
}
```

We also have `TravelInfo` value object to contain info about a travel, and `PurchasedTravel` entity with `info: TravelInfo` property containing information about the purchased travel.

#### Application layer

In the application layer we have the following use-cases:

- `SearchTravels` - searches for travels based on criteria, and gets travel cards
- `GetRecentSearches` - gets all recent searches
- `GetLastMinuteDeals` - gets all last-minute deals
- `PurchaseTravel` - handles the purchase of a travel
- `PurchaseLastMinuteDeal` - handles the purchase of a last-minute deal
- `RenamePurchasedTravel` - renames a purchased travel
- `GetPurchasedTravels` - gets all purchased travels

Also added a service `LastMinuteDealsWatch`. The purpose of the service is to periodically check `TravelsProvider` for new last-minute deals.

Please also check `application/ports/` folder for the defined ports:

- `BookingProvider` - to purchase travels and last-minute deals
- `TravelsProvider` - to get information about travels, last-minute deals, and recent searches
- `PurchasedTravelsRepository` - to manage purchased travels

And also check how ACL is implemented. `PurchasedTravel` is a domain entity with nested `TravelInfo` value object, and is mapped to/from a plain object, very convenient for API clients, who don't need any domain details.

#### Infrastructure layer

Please check `infrastructure/` folder for all implementations.
There's nothing special.
Only one thing that I want to highlight is how the data is stored.
We know nothing about Admin context and this is great, because contexts should know nothing about each other. This allows even to extract a context into a separate package.
And for this reason to retrieve data about offers and special offers in `StorageDataProvider` I directly access storage by the same keys we used in the Admin context. And if you say this is so vulnerable, I would totally agree with you. Of course, should've been better to have shared repositories for managing offers and special offers injected in concretes used in Admin and Travel contexts, so if you like the topic you can try implementing it.

#### Interface

The API is exposed in `interface/api.ts` file.

### Composition root

All our services and use-cases in contexts depend only on abstractions. And now it's time to wire everything together and build complete API in the composition root.

For this purpose create `root/web-app.ts` file. And yes, in `root/` you can create different composition roots using different adapter for different purposes.

Please check `web-app.ts` in the repository to see how the API is composed.

First, we instantiate all infrastructure components, and then we compose the API using these components to make abstract real.

### State persistence

At this stage we have only API. So the client of the API should store received data somewhere else.
This actually can work with our Travel App if we add a thick bridge, say with Redux, create slices, add thunks, and store received data in the slice's state.

But I want to make the application stateful. So I can have more control over access policies and state management.

Let's add stores to the contexts.

Auth context needs `SessionStore`:

```ts
export default interface SessionStore {
  session: Session | null
  status: AuthStatus
  setSession(session: Session | null): void
  setStatus(key: keyof AuthStatus, value: AuthStatus[typeof key]): void
}
```

This way we can allow different parts of the code to know about the session state via providers, middlewares, and other means.

Similarly Travel context needs `TravelStore`, and `LastMinuteDealsStore` which I decided to separate from `TravelStore` to add some logic with new last-minute deals.

Cool. Now we can add these as dependencies to use-cases and services to allow them to update the state accordingly.

You should already have seen them in the code. For examples in `SearchTravels` use-case in the Travel context:

```ts
this.travelStore.setStatus('isLoadingCards', true)
// ...
this.travelStore.setTravelCards(travelCards)
// ...
```

The only thing left is to implement these stores in the infrastructure layer. And before implementing them we need something to allow users of these stores to get informed about changes.

Let's add events mechanism. Events is a good way to orchestrate flows in the application and we'll do one orchestration as well. Also, looking ahead we'll use them to connect stores and hooks.

### Events

A simple event bus sufficient for the application can be defined as:

```ts
export type Event = object

export type EventConstructor<T extends Event = Event> = (new (
  ...args: never[]
) => T) & { id: string }

export default interface EventBus {
  publish(event: Event): void

  subscribe<T extends Event>(
    eventClass: EventConstructor<T>,
    listener: (event: InstanceType<EventConstructor<T>>) => void
  ): () => void
}
```

This is an interface from `shared/ports/event-bus.ts`. And is implemented in `shared/infrastructure/event-emitter-event-bus.ts` using standard `EventEmitter` from `events`.

Now we can define an event in `application/events/` as a simple class with static `id: string` property identifying event type:

```ts
export default class PurchasedTravelAdded {
  public static id = 'Travel.PurchasedTravelAdded'
  public constructor(public readonly purchasedTravel: PurchasedTravelView) {}
}
```

then publish/emit it to the event bus:

```ts
eventBus.publish(new PurchasedTravelAdded(purchasedTravel))
```

And to subscribe:

```ts
eventBus.subscribe(PurchasedTravelAdded, (event) => {
  console.log('Purchased travel added:', event.purchasedTravel)
})
```

I prefer this over using string literals for events because by using application classes you get better type safety and better refactoring support.

Now let's create related events in Auth and Travel contexts and publish them when stores change like in the following store:

```ts
export default class InMemorySessionStore implements SessionStore {
  private _session: Session | null = null

  public constructor(private eventBus: EventBus) {}

  public get session(): Session | null {
    return this._session
  }

  public setSession(session: Session | null): void {
    this._session = session
    this.eventBus.publish(new SessionChanged(session))
  }
}
```

### Hooks

I think now you know how we're going to implement React hooks. Whenever the store changes, the event bus will notify the hooks, allowing them to update their React state accordingly.
And for this pattern let's create a hook factory function:

```ts
export function makeEventHook<
  Args extends unknown[],
  T,
  Events extends EventConstructor<object>[],
>(
  selector: (eventArg: InstanceType<Events[number]> | null, ...args: Args) => T,
  eventBus: EventBus,
  events: Events
) {
  return function (...args: Args) {
    const [state, setState] = useState(selector(null, ...args))

    useEffect(() => {
      const unsubscribe = events.map((event) =>
        eventBus.subscribe(event, (eventArg) => {
          setState(selector(eventArg, ...args))
        })
      )

      return () => {
        unsubscribe.forEach((fn) => fn())
      }
    }, [setState, ...args])

    return state
  }
}
```

It may look creepy at first. But if you watch a little longer, you'll find it is actually quite straightforward. We need to provide three arguments to this function:

- `selector` - a function returning a value for the hook's state, it receives the triggering event object as the first argument or null when initializing the state, and may also receive a number of arguments if a hook is parameterized
- `eventBus` - the EventBus instance to subscribe to events from
- `events` - an array of event classes to listen for

The returned hook will subscribe to the events, update the state accordingly, and unsubscribe when the component unmounts.

There are also two variants of this hook factory for array and object types. The reason for this is objects in a usual app never change their references, but React is based on immutability, this is why we need to create shallow copies for arrays and objects.

Now use these hook factories to compose API for React UI. And this is where we need to remember about the contracts from UI. We do it same way as for exposing context API in the `interface/` folder.

In `auth/interface/react/hooks.ts`:

```ts
export default function composeAuthHooks(
  sessionStore: SessionStore,
  eventBus: EventBus
) {
  return {
    useSession: makeEventHookForObject(() => sessionStore.session, eventBus, [
      SessionChanged,
    ]),
    useStatus: makeEventHook(
      (_event, key: keyof AuthStatus) => sessionStore.status[key],
      eventBus,
      [SessionChanged]
    ),
  }
}
```

And in `travel/interface/react/hooks.ts`:

```ts
export default function composeTravelHooks(
  travelStore: TravelStore,
  lastMinuteDealsStore: LastMinuteDealsStore,
  eventBus: EventBus
) {
  return {
    useSearchCriteria: makeEventHookForObject(
      () => travelStore.searchCriteria,
      eventBus,
      [SearchCriteriaChanged]
    ),
    useTravelCards: makeEventHookForArray(
      () => travelStore.travelCards,
      eventBus,
      [TravelCardsChanged]
    ),
    usePurchasedTravels: makeEventHookForArray(
      () => travelStore.purchasedTravels,
      eventBus,
      [PurchasedTravelsChanged, PurchasedTravelAdded, PurchasedTravelUpdated]
    ),
    useRecentSearches: makeEventHookForArray(
      () => travelStore.recentSearches,
      eventBus,
      [RecentSearchesChanged]
    ),
    useLastMinuteDeals: makeEventHookForArray(
      () => lastMinuteDealsStore.deals,
      eventBus,
      [LastMinuteDealsChanged, LastMinuteDealsAdded]
    ),
    useNewLastMinuteDeals: makeEventHookForArray(
      (event) => event?.lastMinuteDeals || [],
      eventBus,
      [LastMinuteDealsAdded]
    ),
    useStatus: makeEventHook(
      (_event, key: keyof TravelStatus) => travelStore.status[key],
      eventBus,
      [TravelStatusChanged]
    ),
  }
}
```

Notice how `useNewLastMinuteDeals` hook is implemented. All components using it will receive state change only when an event is published. If another component starts using it after recent event has been published, it will get only default value. A nice way to subscribe to events inside components.

These two composers are included in the composition root in `web-app.ts`:

```ts
react: {
  auth: composeAuthHooks(sessionStore, eventBus),
  travel: composeTravelHooks(travelStore, lastMinuteDealsStore, eventBus),
}
```

This is not the only way to create a bridge between application and UI. You can also use Redux or anything else. I've created a boilerplate code in `contexts/travel/interface/redux/` that you can use as a starting point. The only problem I see in this approach is you have to duplicate application state in Redux.

### Orchestrators

Often times we need to listen to events and coordinate flows across different contexts. And for these purposes we can create orchestrators. Let's put them in `processes/` folder.

In the current application we have the following orchestrators:

- `InitProcess` - runs application initialization (restore auth session, start checking new last minute deals)
- `InitSessionProcess` - subscribes to `SessionChanged` event to update stores with related data on session change

They are also initialized and started in the composition root, which is a very beautiful place where you can see how this little virtual world is built.

### Middlewares

Middlewares are a powerful way to extend the functionality of our application by adding additional processing steps, guards, and transformations to the API. I think all libraries have them. Let's add them too.

In our application we have the following middlewares:

- `RequireAuthMiddleware` - checks if the user is authenticated before allowing access to certain use-cases
- `QueryCacheMiddleware` - caches the results of expensive queries to improve performance for a specific duration

Let's take a look at `contexts/auth/middleware/require-auth.ts`:

```ts
export default function makeRequireAuthMiddleware(sessionStore: SessionStore) {
  return function requireAuth<TArgs extends unknown[], TResult>(
    useCase: UseCase<TArgs, TResult>
  ) {
    return {
      async execute(...args: TArgs): Promise<TResult> {
        if (!sessionStore.session) {
          throw new UnauthorizedError('User is not authenticated')
        }

        return useCase.execute(...args)
      },
    }
  }
}
```

Pretty simple, right? A middleware factory receives a `sessionStore` instance and returns a middleware function that can wrap a use-case, becomes a proxy. The middleware checks if the user is authenticated before allowing the use-case to execute, otherwise it throws an error. So simple and so effective.

Please check also a middleware in `shared/middleware/query-cache.ts`. It allows to reuse use-case's results per use-case command during a specific time window and avoid unnecessary re-fetching.

What I want to point out is everything becomes so much simpler to implement if not putting initially ourself in some library's constraints especially considering that the library didn't want us to do it.

## Result

If you've cloned the code, now open `ui/contexts/app.ts` and switch from Demo to WebApp, there should be prepared commented out lines. And do the same in `ui/contexts/provider/app.tsx`. It shouldn't require you to update API calls in components as I tried to keep demo's API same as WebApp's. Then run `npm run dev`.

Try logging in, registering. We haven't implemented logging out, but you can do it yourself. Also, you can delete `session` key in Local Storage in DevTools. In the browser console enter `await api.admin.seed()` (a use-case in Admin context) to populate your local storage with some travel data. Now you should be able to find and purchase a travel of your dreams between the following cities:

- New York
- Los Angeles
- Chicago
- Houston
- Miami
- San Francisco
- Seattle
- Boston
- Denver
- Atlanta

You may also copy **Offer ID** from some travel card, and then enter the following in the console:

`localStorage.setItem('specialOffers', JSON.stringify([...JSON.parse(localStorage.getItem('specialOffers')), { offer_id: '<OFFER_ID>', special_price: 99.99, description: 'Test offer', id: 'my_id' }]))`

And see a new last-minute deal appeared in the list.

## Conclusion

In this article we have built a very nice UI which doesn't perform any side effect by itself, and for this reason it is very easy to develop and maintain. Responsibility for various logic processing and decision making has moved to the application - the central thing that should orchestrate everything, and UI becomes only a presentation of this. We've touched DDD, cared about separation of concerns, didn't forget about SOLID, and implemented a nice layered architecture that allows for easy testing and maintenance, and exported a very convenient API. We've also built a nice bridge between application and UI via hooks and events.

The code may look very verbose, more like a framework, and seems to be overkill. Well, for this particular application - yes. But only now, while the project is small. As the application grows the simpler you start the more mess you have in the project later, because when you have a lot of building blocks in the application, you need more rooms for them, and these rooms need a solid foundation.

So I hope you found this article helpful and some ideas will inspire you to implement something new in your projects.

P.S. It is actually not that bare-metal since I used React for UI, Mantine UI for components, and EventEmitter for event bus. But I thinks that's ok. When you need to make something not very trivial bare-metal for STM32 you still have to use a few basic libraries.

P.P.S. Sorry for my English, I didn't want to process it via AI tools to not lose my identity.

---

© 2025 Stanislav Yaranov
Licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
