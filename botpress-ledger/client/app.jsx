import React from "react"
import axios from "axios"
import { CellsTitle,Form,FormCell,CellBody,CellHeader,Input,TextArea,Label,Select,Button } from "react-weui"
import { getList,addRegister } from "../src/helper/database.js"
import ListCategory from "./categories"
import Picture from "./picture"

const URL_BASE = "/api/botpress-ledger"


export default class OutGo extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      descriptor:"",
      amount:undefined,
      date:"",
      image_URL_BASE:"",
      categories :[],
      categorie_id :""
    }

    this.handleInputChange= this.handleInputChange.bind(this)
    this.handleSubmit= this.handleSubmit.bind(this)
  }

  initState(){
    this.setState({ descriptor:"" })
    this.setState({ amount:0 })
    this.setState({ date:"" })
    this.setState({ image_URL_BASE:"" })
    this.setState({ categorie_id:"" })
  }

  handleSubmit(event) {
    event.preventDefault()
    var data = {}

    Object.keys(this.state).forEach((k)=>{
      if(this.state[k] !== "" || 0){
        if(typeof(this.state[k]) !== "object"){
          // Si Array on ne l'envoi pas comme objet
          data[k.toString()] = this.state[k]
        }
      }
    })

    axios.post(URL_BASE + "/big_book",data)
    .then((resp)=>{
      console.log(resp)
      this.initState()
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  // Pull Data for Category Id
  pullCategoryData(){
    axios.get(URL_BASE + "/categories")
    .then((resp)=>{
      var arr = []
      for (let x of resp.data){
        arr.push(x)
      }
      this.setState({ categories:arr })
    })
    .catch((err)=>{
      console.log(err)
    })

  }

  componentWillMount(){
    this.pullCategoryData()
  }

  render(){
    return(
      <div>
      <CellsTitle>OutGo</CellsTitle>
      <Form onSubmit={this.handleSubmit}>
      <FormCell>
      <CellHeader>
      <Label>Description</Label>
      </CellHeader>
      <CellBody>
      <TextArea name="descriptor" value={this.state.descriptor} onChange={this.handleInputChange} placeholder="Enter Your Description" maxlength="200"></TextArea>
      </CellBody>
      </FormCell>
      <FormCell>
      <CellHeader>
      <Label>$</Label>
      </CellHeader>
      <CellBody>
      <Input name="amount" value={this.state.amount} onChange={this.handleInputChange} placeholder="100.00" />
      </CellBody>
      </FormCell>
      <FormCell>
      <CellHeader>
      <Label>Date</Label>
      </CellHeader>
      <CellBody>
      <Input name="date" value={this.state.date} onChange={this.handleInputChange} type="date"/>
      </CellBody>
      </FormCell>
      <FormCell>
      <CellHeader>
      </CellHeader>
      <CellBody>
      <Picture/>
      </CellBody>
      </FormCell>
      <FormCell select>
      <CellHeader>
        <Label>Choice</Label>
      </CellHeader>
      <CellBody>
      <ListCategory name="categorie_id" value={this.state.categorie_id} list={this.state.categories} onChanges={this.handleInputChange}/>
      </CellBody>
      </FormCell>
      <Button onClick={this.handleSubmit}>Submit</Button>
      </Form>
      </div>
    )
  }
}
