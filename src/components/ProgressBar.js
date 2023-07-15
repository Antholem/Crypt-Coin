import { Card } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const ProgressBar = (props) => {
  return (
      <Box sx={{width: props.width}}>
          <Card
              component="div"
              sx={{
                  width: '100%',
                  height: 14,
                  borderRadius: '5px',
              }}
          >
              <Card sx={{ borderRadius: '5px', height: 14, backgroundImage: 'linear-gradient(25deg, #2600fc, #ff00ea)', width: `${props.percent}%` }} />
          </Card>
      </Box>
  )
}

export default ProgressBar