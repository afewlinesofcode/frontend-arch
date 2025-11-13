import { Button, Card, Group, Text } from '@mantine/core'
import { TravelCard as TravelCardType } from '@/ui/contracts/travel'
import classes from './TravelCard.module.css'
import { getTravelClassLabelByValue } from '../shared/enums/travel-class'

function TravelStat(props: { title: string; value: string }) {
  const { title, value } = props
  return (
    <div>
      <Text size="xs" color="dimmed">
        {title}
      </Text>
      <Text fw={500} size="sm">
        {value}
      </Text>
    </div>
  )
}

export default function TravelCard(props: {
  card: TravelCardType
  onClick: () => void
}) {
  const { card, onClick } = props

  return (
    <Card withBorder padding="lg" radius="md" className={classes.card}>
      <Group justify="space-between" mt="lg">
        <Text className={classes.title}>
          {new Date(card.date).toDateString()}
        </Text>
        <Text fz="xs" c="dimmed">
          Offer ID: {card.id}
        </Text>
      </Group>
      <Text mt="sm" mb="md" c="dimmed" fz="xs">
        Enjoy a comfortable flight from {card.from} to {card.to} with{' '}
        {card.airline} in {card.travelClass} class.
      </Text>
      <Card.Section className={classes.footer}>
        <TravelStat
          title="Class"
          value={getTravelClassLabelByValue(card.travelClass)}
        />
        <TravelStat title="Airline" value={card.airline} />
        <TravelStat title="Price" value={`$${card.price.toFixed(2)}`} />
      </Card.Section>
      <Card.Section className={classes.button}>
        <Button onClick={onClick}>Book now</Button>
      </Card.Section>
    </Card>
  )
}
