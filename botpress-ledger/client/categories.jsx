import React from "react"
import axios from "axios"

import { Select } from "react-weui"


export default class ListCategory extends React.Component {

  constructor(props){
    super(props)

    this.state= {
      categorie_id:"",
    }
    this.choiceChange = this.choiceChange.bind(this)
    // this.onFieldChange = this.onFieldChange.bind(this)
  }

  // onFieldChange(event){
  //   const target = event.target
  //   const value = target.type === 'checkbox' ? target.checked : target.value
  //   const name = target.name
  //   this.props.onChange()
  // }

  choiceChange(e){
    const target = e.target
    const name = target.name
    this.props.onChanges(e)
    this.setState({
      [name]:e.target.value
    })
  }


  render(){
    return (
      <Select name={this.props.name} value={this.state.choice} onChange={this.choiceChange} >
        {
          this.props.list.map((x)=>{
            return(
                <option value={x.id}>
                {x.name}
              </option>
            )
          })
      }
      </Select>
    )
  }
}
