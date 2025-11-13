import { Burger, Group, Drawer, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './Header.module.css'
import { useAppContext } from '../contexts/app'
import { Link, NavLink } from 'react-router'
import { useCallback } from 'react'
import { useUIContext } from '../contexts/ui'

function HeaderDesktopMenu(props: { isLoggedIn: boolean }) {
  const { loginModal } = useUIContext()

  const onLoginClick = useCallback(() => {
    loginModal.open()
  }, [loginModal])

  return (
    <Group gap={5} visibleFrom="xs" className={classes.desktopLinks}>
      <NavLink to="/" className={classes.link}>
        Home
      </NavLink>

      {props.isLoggedIn && (
        <NavLink to="/profile" className={classes.link}>
          Profile
        </NavLink>
      )}

      {!props.isLoggedIn && (
        <Link to="#" className={classes.link} onClick={onLoginClick}>
          Login
        </Link>
      )}
    </Group>
  )
}

function HeaderMobileMenu(props: { isLoggedIn: boolean }) {
  const [opened, { close, toggle }] = useDisclosure(false)

  const hideDrawer = useCallback(() => {
    close()
  }, [close])

  return (
    <>
      <Burger
        opened={opened}
        hiddenFrom="xs"
        className={classes.burger}
        size="sm"
        onClick={toggle}
      />

      <Drawer
        opened={opened}
        hiddenFrom="xs"
        padding="md"
        size="xs"
        title="Navigation"
        position="right"
        onClose={close}
      >
        <Stack>
          <NavLink to="/" className={classes.link} onClick={hideDrawer}>
            Home
          </NavLink>
          {props.isLoggedIn && (
            <NavLink
              to="/profile"
              className={classes.link}
              onClick={hideDrawer}
            >
              Profile
            </NavLink>
          )}
          {!props.isLoggedIn && (
            <Link to="#" className={classes.link} onClick={hideDrawer}>
              Login
            </Link>
          )}
        </Stack>
      </Drawer>
    </>
  )
}

export default function Header() {
  const {
    auth: { useSession },
  } = useAppContext()
  const session = useSession()
  const isLoggedIn = Boolean(session?.email)

  return (
    <header className={classes.header}>
      <div className={classes.brand}>TravelApp</div>

      <HeaderDesktopMenu isLoggedIn={isLoggedIn} />
      <HeaderMobileMenu isLoggedIn={isLoggedIn} />
    </header>
  )
}
