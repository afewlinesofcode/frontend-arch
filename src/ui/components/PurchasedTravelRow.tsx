import { ActionIcon, Table, Menu } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { PurchasedTravel } from '@ui/contracts/travel'
import { getTravelClassLabelByValue } from '@ui/shared/enums/travel-class'

export default function PurchasedTravelRow(props: {
  travel: PurchasedTravel
  onRename: () => void
  onDelete: () => void
}) {
  const { travel } = props

  return (
    <Table.Tr>
      <Table.Td>{travel.name}</Table.Td>
      <Table.Td>
        {travel.from} → {travel.to}
      </Table.Td>
      <Table.Td>{travel.airline}</Table.Td>
      <Table.Td>{getTravelClassLabelByValue(travel.travelClass)}</Table.Td>
      <Table.Td>{new Date(travel.date).toDateString()}</Table.Td>
      <Table.Td>{travel.price}</Table.Td>
      <Table.Td>{new Date(travel.purchasedDate).toDateString()}</Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item
              leftSection={<IconPencil size={14} />}
              onClick={props.onRename}
            >
              Rename Travel
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconTrash size={14} />}
              color="red"
              onClick={props.onDelete}
            >
              Delete Travel
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  )
}
