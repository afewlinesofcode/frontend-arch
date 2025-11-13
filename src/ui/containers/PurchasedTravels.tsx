import { useCallback, useState } from 'react'
import cx from 'clsx'
import { ScrollArea, Table } from '@mantine/core'
import { PurchasedTravel } from '@/ui/contracts/travel'
import { useAppContext } from '../contexts/app'
import { useUIContext } from '../contexts/ui'
import PurchasedTravelRow from '../components/PurchasedTravelRow'
import classes from './PurchasedTravels.module.css'

function useRenameCallback() {
  const { renameModal } = useUIContext()

  return useCallback(
    (travel: PurchasedTravel) => {
      renameModal.open({ travel })
    },
    [renameModal]
  )
}

function useDeleteCallback() {
  const { notify } = useUIContext()

  return useCallback(
    async (travelToDelete: PurchasedTravel) => {
      notify({
        title: 'Delete travel',
        message: `Deleting travel "${travelToDelete.name}" is not implemented yet.`,
        color: 'blue',
      })
    },
    [notify]
  )
}

export default function PurchasedTravels() {
  const { travel } = useAppContext()
  const [scrolled, setScrolled] = useState(false)
  const purchasedTravels = travel.usePurchasedTravels()
  const renameTravel = useRenameCallback()
  const deleteTravel = useDeleteCallback()

  return (
    <ScrollArea
      h={300}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table miw={700}>
        <Table.Thead
          className={cx(classes.header, { [classes.scrolled]: scrolled })}
        >
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Route</Table.Th>
            <Table.Th>Airline</Table.Th>
            <Table.Th>Travel Class</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Purchased Date</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {purchasedTravels.map((travel, index) => (
            <PurchasedTravelRow
              key={index}
              travel={travel}
              onRename={() => renameTravel(travel)}
              onDelete={() => deleteTravel(travel)}
            />
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  )
}
