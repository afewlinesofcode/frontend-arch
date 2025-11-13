import { Button, Grid, TextInput } from '@mantine/core'
import classes from './SearchTravelBar.module.css'
import SearchTravelClasses from '@/ui/components/SearchTravelClasses'
import { useCallback, useEffect, useRef } from 'react'
import { useAppContext } from '../contexts/app'
import { useForm } from '@mantine/form'
import { TravelClass } from '@/ui/shared/enums/travel-class'
import { SearchCriteria } from '@/ui/contracts/travel'
import { useNavigate } from 'react-router'
import { useUIContext } from '../contexts/ui'

type SearchForm = ReturnType<typeof useSearchForm>

/**
 * Search form setup
 * @returns
 */
function useSearchForm() {
  return useForm({
    initialValues: {
      from: '',
      to: '',
      travelClasses: [] as TravelClass[],
    },
  })
}

/**
 * Update form values when search criteria changes (from recent searches, etc.)
 * @param form
 * @param searchCriteria
 */
function useFormUpdate(
  form: SearchForm,
  searchCriteria: SearchCriteria | null
) {
  // Keep a ref to the form to avoid re-running effect on each form change
  const formRef = useRef(form)
  formRef.current = form

  useEffect(() => {
    if (!searchCriteria) {
      return
    }

    const form = formRef.current

    if (
      searchCriteria.from !== form.values.from ||
      searchCriteria.to !== form.values.to ||
      JSON.stringify(searchCriteria.travelClass) !==
        JSON.stringify(form.values.travelClasses)
    ) {
      form.setValues({
        from: searchCriteria.from,
        to: searchCriteria.to,
        travelClasses: searchCriteria.travelClass,
      })
    }
  }, [searchCriteria, formRef])
}

/**
 * Form submission handler
 * @param form
 * @param setSearchCriteria
 * @returns
 */
function useSubmit(form: SearchForm) {
  const { api } = useAppContext()
  const { notify } = useUIContext()
  const navigate = useNavigate()

  const formRef = useRef(form)
  formRef.current = form

  return useCallback(async () => {
    const form = formRef.current

    try {
      await api.travel.searchTravels({
        from: form.values.from,
        to: form.values.to,
        travelClass: form.values.travelClasses,
      })

      navigate('/')
    } catch (e) {
      notify({
        color: 'red',
        title: 'Search error',
        message: (e as Error).message,
      })
    }
  }, [formRef, api, notify, navigate])
}

/**
 * Search travel bar component
 * @returns
 */
export default function SearchTravelBar() {
  const { travel } = useAppContext()
  const isLoading = travel.useStatus('isLoadingCards')
  const searchCriteria = travel.useSearchCriteria()

  // Form setup
  const form = useSearchForm()

  // Populate form if search criteria changed
  useFormUpdate(form, searchCriteria)

  // Form submission
  const submit = useSubmit(form)

  return (
    <form onSubmit={form.onSubmit(submit)}>
      <div className={classes.searchBar}>
        <Grid className={classes.grid} gutter="md">
          <Grid.Col span={{ base: 12, sm: 10 }}>
            <Grid className={classes.grid} gutter="md">
              <Grid.Col span={{ base: 12, xs: 3, lg: 4 }}>
                <TextInput
                  value={form.values.from}
                  onChange={(event) =>
                    form.setFieldValue('from', event.currentTarget.value)
                  }
                  label="Departure"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 3, lg: 4 }}>
                <TextInput
                  value={form.values.to}
                  onChange={(event) =>
                    form.setFieldValue('to', event.currentTarget.value)
                  }
                  label="Destination"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6, lg: 4 }}>
                <SearchTravelClasses
                  value={form.values.travelClasses}
                  onChange={(value) =>
                    form.setFieldValue('travelClasses', value)
                  }
                />
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col
            span={{ base: 12, sm: 2 }}
            className={classes.gridColSearch}
          >
            <Button
              type="submit"
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </Grid.Col>
        </Grid>
      </div>
    </form>
  )
}
