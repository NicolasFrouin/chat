import { ActionIcon, Button, Grid, Popover, ScrollArea, Tabs, Tooltip } from '@mantine/core';
import { IconMoodSmile } from '@tabler/icons-react';
import { useState } from 'react';

// Emoji categories
const EMOJIS = {
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗'],
  gestures: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅'],
};

// Kaomoji categories
const KAOMOJIS = {
  happy: ['(•‿•)', '(◕‿◕)', '(｡◕‿◕｡)', 'ヽ(•‿•)ノ', '(づ｡◕‿‿◕｡)づ', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧'],
  sad: ['(╥﹏╥)', '(┬┬﹏┬┬)', '(╯︵╰,)', '(っ˘̩╭╮˘̩)っ', '(◞‸◟；)'],
  angry: ['(╬ಠ益ಠ)', '(ㆆ_ㆆ)', '(ಠ_ಠ)', '(¬_¬)', `(ง'̀-'́)ง`, '┌∩┐(◣_◢)┌∩┐'],
  misc: ['¯\\_(ツ)_/¯', '(•_•)', '( •_•)>⌐■-■', '(⌐■_■)', '(☞ﾟヮﾟ)☞', 'ᕙ(⇀‸↼‶)ᕗ', '♪┏(・o･)┛♪┗ ( ･o･) ┓♪'],
};

interface EmojiSelectorProps {
  onEmojiSelect: (emoji: string) => void;
}

export default function EmojiSelector({ onEmojiSelect }: EmojiSelectorProps) {
  const [opened, setOpened] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpened(false);
  };

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position='top-end'
      shadow='md'
      width={320} // Slightly wider to accommodate content
    >
      <Popover.Target>
        <Tooltip label='Add emoji'>
          <ActionIcon
            variant='light'
            color='blue'
            onClick={() => setOpened((o) => !o)}
            size='lg'
          >
            <IconMoodSmile size='1.125rem' />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>

      <Popover.Dropdown style={{ padding: '0.5rem' }}>
        <Tabs defaultValue='smileys'>
          <Tabs.List grow>
            <Tabs.Tab
              value='smileys'
              style={{ minWidth: 0, padding: '0.5rem 0' }}
            >
              Smileys
            </Tabs.Tab>
            <Tabs.Tab
              value='gestures'
              style={{ minWidth: 0, padding: '0.5rem 0' }}
            >
              Gestures
            </Tabs.Tab>
            <Tabs.Tab
              value='kaomoji'
              style={{ minWidth: 0, padding: '0.5rem 0' }}
            >
              Kaomoji
            </Tabs.Tab>
            <Tabs.Tab
              value='other'
              style={{ minWidth: 0, padding: '0.5rem 0' }}
            >
              More
            </Tabs.Tab>
          </Tabs.List>

          <ScrollArea
            h={200}
            type='always'
            offsetScrollbars
            scrollbarSize={6}
            mt='xs'
          >
            {/* Smileys Tab */}
            <Tabs.Panel
              value='smileys'
              pt='xs'
            >
              <Grid gutter='xs'>
                {EMOJIS.smileys.map((emoji, i) => (
                  <Grid.Col
                    span={3}
                    key={i}
                  >
                    <Button
                      variant='subtle'
                      onClick={() => handleEmojiClick(emoji)}
                      p={0}
                      style={{ fontSize: '1.4rem', width: '100%', height: '2.5rem' }}
                      fullWidth
                    >
                      {emoji}
                    </Button>
                  </Grid.Col>
                ))}
              </Grid>
            </Tabs.Panel>

            {/* Gestures Tab */}
            <Tabs.Panel
              value='gestures'
              pt='xs'
            >
              <Grid gutter='xs'>
                {EMOJIS.gestures.map((emoji, i) => (
                  <Grid.Col
                    span={3}
                    key={i}
                  >
                    <Button
                      variant='subtle'
                      onClick={() => handleEmojiClick(emoji)}
                      p={0}
                      style={{ fontSize: '1.4rem', width: '100%', height: '2.5rem' }}
                      fullWidth
                    >
                      {emoji}
                    </Button>
                  </Grid.Col>
                ))}
              </Grid>
            </Tabs.Panel>

            {/* Kaomoji Tab */}
            <Tabs.Panel
              value='kaomoji'
              pt='xs'
            >
              <Grid gutter='xs'>
                {[...KAOMOJIS.happy, ...KAOMOJIS.sad].map((kaomoji, i) => (
                  <Grid.Col
                    span={12}
                    key={i}
                  >
                    <Button
                      variant='subtle'
                      onClick={() => handleEmojiClick(kaomoji)}
                      size='compact-sm'
                      style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      fullWidth
                    >
                      {kaomoji}
                    </Button>
                  </Grid.Col>
                ))}
              </Grid>
            </Tabs.Panel>

            {/* Other Tab */}
            <Tabs.Panel
              value='other'
              pt='xs'
            >
              <Grid gutter='xs'>
                {[...EMOJIS.animals, ...EMOJIS.food].map((emoji, i) => (
                  <Grid.Col
                    span={3}
                    key={i}
                  >
                    <Button
                      variant='subtle'
                      onClick={() => handleEmojiClick(emoji)}
                      p={0}
                      style={{ fontSize: '1.4rem', width: '100%', height: '2.5rem' }}
                      fullWidth
                    >
                      {emoji}
                    </Button>
                  </Grid.Col>
                ))}
                {KAOMOJIS.angry.concat(KAOMOJIS.misc).map((kaomoji, i) => (
                  <Grid.Col
                    span={12}
                    key={`k-${i}`}
                  >
                    <Button
                      variant='subtle'
                      onClick={() => handleEmojiClick(kaomoji)}
                      size='compact-sm'
                      style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      fullWidth
                    >
                      {kaomoji}
                    </Button>
                  </Grid.Col>
                ))}
              </Grid>
            </Tabs.Panel>
          </ScrollArea>
        </Tabs>
      </Popover.Dropdown>
    </Popover>
  );
}
