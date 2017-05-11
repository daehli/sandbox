import React from "react"
import { ActionSheet,Button } from "react-weui"

export default class Picture extends React.Component {

  constructor(props){
    super(props)

    this.state={
      auto_show: false,
      menus:[{
        label: 'Take Picture',
        onClick: ()=> {}
      }, {
        label: 'Picture library',
        onClick: ()=> {}
      }],
      actions: [
        {
          label: 'Close',
          onClick: this.hide.bind(this)
        }
      ]
    }

    this.hide = this.hide.bind(this)
  }

  hide(){
    this.setState( {
      auto_show:false
    } )
  }

  render(){
    return(
    <div>
    <Button type="default" onClick={e=>this.setState({ auto_show:true })} >
    Picture
    </Button>
    <ActionSheet
    menus={this.state.menus}
    actions={this.state.actions}
    show={this.state.auto_show}
    onRequestClose={e=>this.setState({ auto_show: false })}
    />
    </div>
    )
  }

}
