import React from "react"
import axios from "axios"

import { Select,Button,Form,FormCell,CellHeader,CellBody,Input,VCode,CellFooter,Label } from "react-weui"

import RowCategories from "./row_categories"
import AddCategories from "./add_categories"


const URL_BASE = "/api/botpress-ledger"


export default class Main extends React.Component {

  constructor(props){
    super(props)

    this.state= {
      categories:[],
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleListChange = this.handleListChange.bind(this)
    this.handleListAdd = this.handleListAdd.bind(this)
  }

  // Pull Data for Category Id
  pullCategoryData(){
    axios.get(URL_BASE + "/categories").then((resp)=>{
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

  componentWillMount() {
    this.pullCategoryData()
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleListChange(id){
    var arr = this.state.categories
    var newArr = []
    for(let x of arr){
      console.log(x)
      if (parseInt(x.id) !== parseInt(id)){
        newArr.push(x)
      }
    }
    console.log(newArr)
    this.setState({ categories:newArr })
  }

  handleListAdd(name){
    var newArray = this.state.categories.slice()
    newArray.push(JSON.parse(name))
    this.setState({ categories: newArray })
  }


  render(){
    return(
      <div>
        {
          this.state.categories.map((x)=>{
            return(
              <div>
                <ol><RowCategories name={x.name} id={x.id} onChanges={this.handleListChange} /></ol>
              </div>
            )
          })
        }
        <AddCategories onAdd={this.handleListAdd} />
      </div>
    )
  }
}
