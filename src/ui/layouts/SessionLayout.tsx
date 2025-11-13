import { ReactNode } from 'react'
import { Flex } from '@mantine/core'
import Header from '../containers/Header'
import SearchTravelBar from '../containers/SearchTravelBar'

export default function SessionLayout(props: { children: ReactNode }) {
  return (
    <Flex direction="column" style={{ minHeight: '100vh' }}>
      <Header />

      <SearchTravelBar />

      {props.children}
    </Flex>
  )
}
