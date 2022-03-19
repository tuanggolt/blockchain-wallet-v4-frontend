import React from 'react'

import { SelectBox } from 'components/Form'

const elements = [
  {
    group: '',
    items: [
      {
        text: 'Id',
        value: 'id'
      },
      {
        text: 'Text',
        value: 'text'
      }
    ]
  }
]

export const SelectBoxMemo = (props) => <SelectBox elements={elements} {...props} />
