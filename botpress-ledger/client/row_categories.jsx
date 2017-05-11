import React, { PropTypes } from 'react'
import axios from "axios"
import { Button,Cells,Cell,CellHeader,CellFooter,CellBody,VCode,Input } from "react-weui"

const URL_BASE = "/api/botpress-ledger"

class RowCategories extends React.Component {

  constructor(props){
    super(props)
    this.state= {
      name:this.props.name,
      toggle:false
    }
    this.deleteElement = this.deleteElement.bind(this)
    this.toggleUpdateElement = this.toggleUpdateElement.bind(this)
    this.cancelUpdate = this.cancelUpdate.bind(this)
    this.updateElement = this.updateElement.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  deleteElement(event){
    event.preventDefault()
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    axios.delete(URL_BASE + "/categories/"+value)
    .then((resp)=>{
      this.props.onChanges(value)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    console.log(value)

    this.setState({
      [name]: value
    })
  }

  updateElement(event){
    event.preventDefault()
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    console.log(value)

    this.setState({
      [name]: value
    })

    this.setState({ toggle:false })
  }

  toggleUpdateElement(event){
    event.preventDefault()
    this.setState({ toggle:true })
    this.setState({ name:this.props.name })
  }

  cancelUpdate(event){
    event.preventDefault()
    this.setState({ toggle:false })
    this.setState({ name:this.props.name })
  }


  render () {
    return(
      <li>
        <Cells>
          <Cell>
            <CellHeader>
              *
            </CellHeader>
            <CellBody>
              {!this.state.toggle ?
                <div>{this.props.name}</div>
                :
                <div>
                  <Input name="name" defaultValue={this.props.name} onChange={this.handleInputChange}></Input>
                </div>
              }
            </CellBody>
            <CellFooter>
              {!this.state.toggle ?
                <div>
                  <Button size="small" value={this.props.id} onClick={this.deleteElement}>Trash</Button>
                  <Button size="small" onClick={this.toggleUpdateElement}>Edit</Button>
                </div>
                :
                <div>
                  <Button onClick={this.updateElement} size="small">Update</Button>
                  <Button onClick={this.cancelUpdate} size="small" type="warn">Cancel</Button>
                </div>
              }

            </CellFooter>
          </Cell>
        </Cells>
      </li>
    )
  }
}

export default RowCategories
