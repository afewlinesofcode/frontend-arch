import { useCallback, useEffect } from 'react'
import {
  Modal,
  Button,
  Paper,
  Text,
  Group,
  Stack,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAppContext } from '../contexts/app'
import { useUIContext } from '../contexts/ui'
import useToggled from '../hooks/use-toggled'

type RenameForm = ReturnType<typeof useRenameForm>

/**
 * Rename form setup
 * @returns
 */
function useRenameForm() {
  return useForm({
    initialValues: {
      name: '',
    },
  })
}

/**
 * Reset form when modal is opened
 * @param form
 */
function useFormReset(form: RenameForm) {
  const { renameModal } = useUIContext()

  const openedToggled = useToggled(renameModal.opened)

  useEffect(() => {
    if (openedToggled) {
      if (renameModal.opened) {
        // Populate form with current travel name
        form.setFieldValue('name', renameModal.params.travel?.name || '')
      } else {
        // Clear connected travel on close
        renameModal.setParams({ travel: null })
      }
    }
  }, [openedToggled, renameModal, form])
}

/**
 * Form submission handler
 * @param form
 * @returns
 */
function useFormSubmit(form: RenameForm) {
  const { api: app } = useAppContext()
  const { renameModal, notify } = useUIContext()

  return useCallback(async () => {
    if (!renameModal.params.travel) {
      notify({
        title: 'Error',
        message: 'No travel selected for renaming',
        color: 'red',
      })
      return
    }

    try {
      await app.travel.renamePurchasedTravel({
        travelId: renameModal.params.travel.id,
        newName: form.values.name,
      })

      renameModal.close()

      notify({
        title: 'Success',
        message: 'Travel renamed successfully',
        color: 'green',
      })
    } catch (e) {
      notify({
        title: 'Authentication error',
        message: (e as Error).message,
        color: 'red',
      })
    }
  }, [form, app, renameModal, notify])
}

/**
 * Rename modal component
 * @returns
 */
export default function RenameModal() {
  const { renameModal } = useUIContext()
  const form = useRenameForm()
  const submit = useFormSubmit(form)
  useFormReset(form)
  const travel = renameModal.params.travel

  if (!travel) {
    return null
  }

  return (
    <Modal
      opened={renameModal.opened}
      onClose={renameModal.close}
      title="Rename Travel"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Paper radius="md" p="lg" withBorder>
        <Text size="lg" fw={500}>
          Rename travel {travel.name}
        </Text>

        <form onSubmit={form.onSubmit(submit)}>
          <Stack>
            <TextInput
              label="New name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue('name', event.currentTarget.value)
              }
              radius="md"
            />
          </Stack>

          <Group justify="flex-end" mt="xl">
            <Button type="submit" radius="xl">
              Rename
            </Button>
          </Group>
        </form>
      </Paper>
    </Modal>
  )
}
