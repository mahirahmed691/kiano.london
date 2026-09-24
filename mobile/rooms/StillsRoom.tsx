import { useEffect, useRef } from 'react'
import { FlatList, type NativeScrollEvent, type NativeSyntheticEvent, View } from 'react-native'

import { HouseStill } from '../HouseStill'
import { instagramPlates, plateCopy, plateNumber, thisWeekPlate } from '../catalogue'
import { color } from '../theme'
import { type HouseNav } from './nav'

type Props = HouseNav & {
  plateId?: string
}

export function StillsRoom({ open, roomHeight, onOverlay, plateId }: Props) {
  const list = useRef<FlatList<(typeof instagramPlates)[number]>>(null)
  const week = thisWeekPlate()

  useEffect(() => {
    onOverlay(true)
  }, [onOverlay])

  useEffect(() => {
    if (!plateId) return
    const index = instagramPlates.findIndex((plate) => plate.id === plateId)
    if (index < 0) return
    const timer = setTimeout(() => {
      list.current?.scrollToIndex({ index, animated: false })
    }, 40)
    return () => clearTimeout(timer)
  }, [plateId, roomHeight])

  return (
    <View style={{ flex: 1, backgroundColor: color.night }}>
      <FlatList
        ref={list}
        data={instagramPlates}
        keyExtractor={(plate) => plate.id}
        pagingEnabled
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: roomHeight,
          offset: roomHeight * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          list.current?.scrollToOffset({ offset: info.index * roomHeight, animated: false })
        }}
        onMomentumScrollEnd={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
          onOverlay(true)
          void event
        }}
        renderItem={({ item }) => {
          const copy = plateCopy(item.caption)
          const kicker =
            item.id === week.id
              ? item.place === item.name
                ? 'This week'
                : `This week · ${item.place}`
              : `${plateNumber(item)} · ${item.place}`
          return (
            <HouseStill
              src={item.src}
              alt={item.alt}
              objectPosition={item.objectPosition}
              kicker={kicker}
              title={copy.lines[0] ?? item.name}
              quiet
              height={roomHeight}
              onPress={() => open(item.to ?? '/story')}
            />
          )
        }}
      />
    </View>
  )
}
