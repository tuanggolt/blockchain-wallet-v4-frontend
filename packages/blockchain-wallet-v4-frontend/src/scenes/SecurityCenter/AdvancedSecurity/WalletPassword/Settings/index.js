import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'

import Settings from './template'

class SettingsContainer extends React.PureComponent {
  state = { updateToggled: false }

  onSubmit = () => {
    this.props.walletActions.setMainPassword(this.props.newWalletPasswordValue)
    this.props.formActions.reset('settingWalletPassword')
    this.handleToggle()
  }

  handleToggle = () => {
    this.props.formActions.reset('settingWalletPassword')
    this.setState({
      updateToggled: !this.state.updateToggled
    })
  }

  render() {
    const { ...rest } = this.props

    return (
      <Settings
        {...rest}
        updateToggled={this.state.updateToggled}
        handleToggle={this.handleToggle}
        onSubmit={this.onSubmit}
        handleCancel={() => {
          this.props.formActions.reset('settingWalletPassword')
          this.handleToggle()
        }}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  currentWalletPassword: selectors.core.wallet.getMainPassword(state),
  newWalletPasswordValue: formValueSelector('settingWalletPassword')(state, 'newPassword') || '',
  walletPasswordValue: formValueSelector('settingWalletPassword')(state, 'currentPassword')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
