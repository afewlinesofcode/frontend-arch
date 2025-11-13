import {
  Checkbox,
  Combobox,
  Group,
  Input,
  Pill,
  PillsInput,
  useCombobox,
} from '@mantine/core'
import { useCallback, useMemo } from 'react'
import {
  findTravelClassInfoByValue,
  TravelClass,
  travelClassesInfo,
  TravelClassInfo,
} from '@ui/shared/enums/travel-class'

export default function SearchTravelClasses(props: {
  value: TravelClass[]
  onChange: (value: TravelClass[]) => void
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const value = useMemo(
    () => travelClassesInfo.filter((info) => props.value.includes(info.value)),
    [props.value]
  )

  const handleSelect = useCallback(
    (itemValue: string) => {
      const info = findTravelClassInfoByValue(itemValue)
      if (!info) return

      if (value.includes(info)) {
        props.onChange(value.filter((v) => v !== info).map((v) => v.value))
      } else {
        props.onChange([...value.map((v) => v.value), info.value])
      }
    },
    [value, props]
  )

  const handleRemove = (info: TravelClassInfo) => {
    props.onChange(value.filter((v) => v !== info).map((v) => v.value))
  }

  const values = value.map((info) => (
    <Pill key={info.value} withRemoveButton onRemove={() => handleRemove(info)}>
      {info.label}
    </Pill>
  ))

  const options = travelClassesInfo.map((info) => (
    <Combobox.Option
      value={info.value}
      key={info.value}
      active={value.includes(info)}
    >
      <Group gap="sm" wrap="nowrap">
        <Checkbox
          checked={value.includes(info)}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          style={{ pointerEvents: 'none' }}
        />
        <span>{info.label}</span>
      </Group>
    </Combobox.Option>
  ))

  return (
    <Input.Wrapper label="Travel class">
      <Combobox
        store={combobox}
        onOptionSubmit={handleSelect}
        withinPortal={false}
      >
        <Combobox.DropdownTarget>
          <PillsInput pointer onClick={() => combobox.toggleDropdown()}>
            <Pill.Group>
              {values.length > 0 ? (
                values
              ) : (
                <Input.Placeholder>Pick one or more values</Input.Placeholder>
              )}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  type="hidden"
                  onBlur={() => combobox.closeDropdown()}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && value.length > 0) {
                      event.preventDefault()
                      handleRemove(value[value.length - 1])
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  )
}
