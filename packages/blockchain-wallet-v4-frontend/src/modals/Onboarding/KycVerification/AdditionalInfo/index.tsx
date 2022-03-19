import { connect, ConnectedProps } from 'react-redux'

import { actions } from 'data'

import AdditionalInfo from './template'

const mapDispatchToProps = (dispatch) => ({
  closeAllModals: () => dispatch(actions.modals.closeAllModals()),
  goToNextStep: () => dispatch(actions.components.identityVerification.goToNextStep())
})

const connector = connect(undefined, mapDispatchToProps)

export type OwnProps = {
  onClose: () => void
}

export type Props = OwnProps & ConnectedProps<typeof connector>
export default connector(AdditionalInfo)
