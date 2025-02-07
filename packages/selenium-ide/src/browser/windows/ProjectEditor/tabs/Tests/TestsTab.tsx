import Paper from '@mui/material/Paper'
import { getActiveCommand, getActiveTest } from '@seleniumhq/side-api/dist/helpers/getActiveData'
import { useHeightFromElement } from 'browser/helpers/useHeightFromElement'
import React, { useEffect } from 'react'
import CommandEditor from './TestCommandEditor'
import CommandList from './TestCommandList'
import CommandTable from './TestCommandTable'
import { CoreSessionData } from '@seleniumhq/side-api'
import MainHeader from '../../components/Main/Header'
import { loadingID } from '@seleniumhq/side-api/dist/constants/loadingID'
import { Typography, useMediaQuery } from '@mui/material'

const sxCenter = { textAlign: 'center' }
const NoTestFound = () => (
  <>
    <MainHeader />
    <Paper className="p-4" elevation={1} id="command-editor" square>
      <Typography sx={sxCenter}>No Test Selected</Typography>
    </Paper>
  </>
)

const TestsTab: React.FC<{
  session: CoreSessionData
}> = ({ session }) => {
  const {
    state: {
      activeTestID,
      commands,
      editor: { selectedCommandIndexes },
      playback,
    },
  } = session

  const isTableWidth = useMediaQuery('only screen and (min-width: 600px)')
  const CommandsComponent = isTableWidth ? CommandTable : CommandList
  const bottomOffset = useHeightFromElement('command-editor')
  useEffect(() => {
    window.sideAPI.state.openTestEditor()
    return () => {
      window.sideAPI.state.closeTestEditor()
    }
  }, [])

  if (activeTestID === loadingID) {
    return <NoTestFound />
  }

  const activeTest = getActiveTest(session)
  const activeCommand = getActiveCommand(session)
  return (
    <>
      <MainHeader />
      <CommandsComponent
        activeTest={activeTestID}
        bottomOffset={bottomOffset}
        commands={activeTest.commands}
        commandStates={playback.commands}
        selectedCommandIndexes={selectedCommandIndexes}
      />
      <Paper
        elevation={1}
        id="command-editor"
        square
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
        }}
      >
        <CommandEditor
          commands={commands}
          command={activeCommand}
          selectedCommandIndexes={selectedCommandIndexes}
          testID={activeTestID}
        />
      </Paper>
    </>
  )
}

export default TestsTab
