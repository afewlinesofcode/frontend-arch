import { Modal, Paper, Text } from '@mantine/core'
import { useUIContext } from '../contexts/ui'
import { Link } from 'react-router'

/**
 * Congratulations modal component
 * @returns
 */
export default function CongratulationsModal() {
  const { congratulationsModal } = useUIContext()

  return (
    <Modal
      opened={congratulationsModal.opened}
      onClose={congratulationsModal.close}
      title="Congratulations"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Paper radius="md" p="lg" withBorder>
        <Text size="lg" fw={500}>
          Congratulations on your successful purchase!
        </Text>
        <Text size="sm" mt="md">
          Please find travel details on your{' '}
          <Link to="/profile" onClick={() => congratulationsModal.close()}>
            profile page
          </Link>
          .
        </Text>
      </Paper>
    </Modal>
  )
}
