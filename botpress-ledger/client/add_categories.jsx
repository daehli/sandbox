import React, { PropTypes } from 'react'
import axios from "axios"
import { Select,Button,Form,FormCell,CellHeader,CellBody,Input,VCode,CellFooter,Label } from "react-weui"

const URL_BASE = "/api/botpress-ledger"

class AddCategories extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      choice:"",
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit(e){
    e.preventDefault()
    var data = {}
    if(this.state.choice !== undefined){
      data.name = this.state.choice
      axios.post(URL_BASE+"/categories/add",data)
      .then((resp)=>{
        this.props.onAdd(resp.config.data)
        this.setState({ choice:"" })
      })
      .catch((err)=>{
        console.log(err)
      })
    }
  }

  render () {
    return(
      <Form>
        <FormCell vcode>
          <CellHeader>
            <Label>Category</Label>
          </CellHeader>
          <CellBody>
            <Input name="choice" onChange={this.handleInputChange} placeholder="Add your Categories" />
          </CellBody>
          <CellFooter>
            <Button onClick={this.handleSubmit} type="vcode">Add</Button>
          </CellFooter>
        </FormCell>
      </Form>
    )
  }
}

export default AddCategories
