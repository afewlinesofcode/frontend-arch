# Rules

## UI

### Directories

- `components/` - reusable UI pure components that can be used across different parts of the application
- `containers/` - components that are aware of the application or UI, or other context
- `contexts/` - React contexts and providers
- `contracts/` - TypeScript types and interfaces that define the data structures and entities used in the UI. Application API is expected to follow these contracts
- `hooks/` - custom React hooks for UI logic to be used across components
- `layouts/` - layout components that define the overall structure of pages or sections
- `modals/` - modal components for displaying overlay dialogs
- `pages/` - components that represent full pages in the application
- `shared/` - shared utilities and types that can be used across different parts of the UI

### Contracts

Whenever a new hook or a new data is needed from the API it has to be added in `contracts/`. Application API needs to be updated accordingly.

## Application

### Directories

- `contexts/` - contains bounded contexts
  - `domain/` - contains objects defining the context domain
  - `application/` - contains application services and use cases orchestrating workflows
  - `infrastructure/` - contains infrastructure implementations and integrations
  - `interface/` - contains exposed interfaces to the context
- `processes/` - contains application orchestrating processes
- `root/` - contains composition roots
- `shared/` - application objects shared across different bounded contexts, contains directory structure similar to bounded context

### Context rules

All classes should only depend on abstractions. Concretes defined in `infrastructure/` are instantiated only in composition roots.

Domains always remain isolated. Only context application layer can access it to perform business logic, and infrastructure layer to provide implementations.

### Processes rules

Processes can orchestrate workflows across contexts. For this reason they can import contracts and events from the depended contexts' application layer, but never access domain.
