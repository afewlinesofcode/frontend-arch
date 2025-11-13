import { useCallback, useEffect } from 'react'
import { upperFirst } from 'lodash'
import { useToggle } from '@mantine/hooks'
import {
  Modal,
  Button,
  Paper,
  Text,
  Group,
  Stack,
  TextInput,
  PasswordInput,
  Anchor,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAppContext } from '../contexts/app'
import { useUIContext } from '../contexts/ui'
import useToggled from '../hooks/use-toggled'

type AuthForm = ReturnType<typeof useAuthForm>

/**
 * Authentication form setup
 * @returns
 */
function useAuthForm() {
  return useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },
  })
}

/**
 * Reset form when modal is closed
 * @param form
 * @param toggle
 */
function useFormReset(form: AuthForm, toggle: (value?: string) => void) {
  const { loginModal } = useUIContext()

  const openedToggled = useToggled(loginModal.opened)

  useEffect(() => {
    if (openedToggled && !loginModal.opened) {
      form.reset()
      toggle('login')
    }
  }, [openedToggled, loginModal, form, toggle])
}

/**
 * Form submission handler
 * @param form
 * @param type
 * @returns
 */
function useFormSubmit(form: AuthForm, type: string) {
  const { api: app } = useAppContext()
  const { loginModal, notify } = useUIContext()

  return useCallback(async () => {
    try {
      if (type === 'login') {
        await app.auth.login({
          email: form.values.email,
          password: form.values.password,
        })
      } else if (type === 'register') {
        await app.auth.register({
          name: form.values.name,
          email: form.values.email,
          password: form.values.password,
        })
      }

      loginModal.close()
    } catch (e) {
      notify({
        title: 'Authentication error',
        message: (e as Error).message,
        color: 'red',
      })
    }
  }, [form, type, app, loginModal, notify])
}

/**
 * Login / Register modal component
 * @returns
 */
export default function LoginModal() {
  const { loginModal } = useUIContext()
  const { auth } = useAppContext()
  const isLoading = auth.useStatus('isLoading')
  const [type, toggle] = useToggle(['login', 'register'])
  const form = useAuthForm()
  const submit = useFormSubmit(form, type)
  useFormReset(form, toggle)

  return (
    <Modal
      opened={loginModal.opened}
      onClose={loginModal.close}
      title={upperFirst(type)}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Paper radius="md" p="lg" withBorder>
        <Text size="lg" fw={500}>
          Welcome to TravelApp, {type} with
        </Text>

        <form onSubmit={form.onSubmit(submit)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue('name', event.currentTarget.value)
                }
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue('email', event.currentTarget.value)
              }
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue('password', event.currentTarget.value)
              }
              error={
                form.errors.password &&
                'Password should include at least 6 characters'
              }
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl" disabled={isLoading}>
              {isLoading ? 'Loading...' : upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Modal>
  )
}
