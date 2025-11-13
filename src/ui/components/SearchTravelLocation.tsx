import { useState } from 'react'
import { TextInput } from '@mantine/core'

export default function SearchTravelLocation(props: { title: string }) {
  const [value, setValue] = useState('')

  return (
    <TextInput
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      label={props.title}
    />
  )
}
