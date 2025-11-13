import { IconAt } from '@tabler/icons-react'
import { Avatar, Group, Text } from '@mantine/core'
import classes from './UserInfo.module.css'
import { Session } from '@/ui/contracts/auth'

export default function UserInfo(props: { session: Session }) {
  const {
    session: { name, email },
  } = props
  return (
    <div>
      <Group wrap="nowrap">
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
          size={94}
          radius="md"
        />
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            Bronze traveler
          </Text>

          <Text fz="lg" fw={500} className={classes.name}>
            {name}
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size={16} className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {email}
            </Text>
          </Group>
        </div>
      </Group>
    </div>
  )
}
