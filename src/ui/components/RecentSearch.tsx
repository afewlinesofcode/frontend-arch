import { Button, Card, Text } from '@mantine/core'
import { SearchCriteria } from '@/ui/contracts/travel'
import classes from './TravelCard.module.css'
import { getTravelClassLabelByValue } from '../shared/enums/travel-class'

export default function RecentSearch(props: {
  value: SearchCriteria
  onClick: () => void
}) {
  const { value, onClick } = props

  return (
    <Card withBorder padding="lg" radius="md" className={classes.recentSearch}>
      <Text className={classes.location}>
        {value.from} → {value.to}
      </Text>
      <Text fz="xs" c="dimmed">
        {value.travelClass.map(getTravelClassLabelByValue).join(', ')}
      </Text>
      <Card.Section className={classes.button}>
        <Button onClick={onClick}>Search again</Button>
      </Card.Section>
    </Card>
  )
}
