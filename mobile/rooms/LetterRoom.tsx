import { StyleSheet, Text, View } from 'react-native'

import { RoomScroll, paper } from '../HousePaper'
import { Body, Display, Eyebrow, GhostLink, OutlineButton } from '../HouseType'
import { legalLetter } from '../catalogue'
import { color, type } from '../theme'
import { type HouseNav } from './nav'

type Props = HouseNav & {
  path: '/privacy' | '/cookies' | '/returns'
}

export function LetterRoom({ path, open, openWeb, roomHeight, bottomInset }: Props) {
  const letter = legalLetter(path)
  if (!letter) return null

  return (
    <RoomScroll bottomInset={bottomInset} heroHeight={roomHeight}>
      <View style={[paper(), styles.pad]}>
        <Eyebrow>{letter.kicker}</Eyebrow>
        <View style={styles.space} />
        <Display size={36}>{letter.title}</Display>
        <View style={styles.gap} />
        <Body>{letter.lead}</Body>
        <View style={styles.blocks}>
          {letter.blocks.map((block) => (
            <View key={block.kicker}>
              <Text style={styles.kicker}>{block.kicker}</Text>
              <Body>{block.copy}</Body>
            </View>
          ))}
        </View>
        <View style={styles.gap} />
        <Body>{letter.close}</Body>
        {letter.write ? (
          <View style={styles.actions}>
            <OutlineButton label={letter.write.label} onPress={() => openWeb(letter.write!.to)} />
            <GhostLink label="Ask after a reserved cut" onPress={() => openWeb('/reservation')} />
          </View>
        ) : (
          <View style={styles.actions}>
            <GhostLink label="The Shop" onPress={() => open('/shop')} />
            {path === '/privacy' ? (
              <GhostLink label="Cookies" onPress={() => open('/cookies')} />
            ) : (
              <GhostLink label="Privacy" onPress={() => open('/privacy')} />
            )}
          </View>
        )}
      </View>
    </RoomScroll>
  )
}

const styles = StyleSheet.create({
  pad: {
    paddingTop: 28,
  },
  space: { height: 16 },
  gap: { height: 18 },
  blocks: {
    marginTop: 36,
    gap: 28,
  },
  kicker: {
    marginBottom: 10,
    color: color.stone,
    fontFamily: type.sansRegular,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  actions: {
    marginTop: 32,
    gap: 18,
    alignItems: 'flex-start',
  },
})
