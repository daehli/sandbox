import React from "react"
import {CellsTitle,Form,FormCell,CellBody,CellHeader,Input,TextArea,Label,Select,Button} from "react-weui"
import {getList,addRegister} from "../src/helper/database.js"

function ListCategory(props){
  return(
    <option value={props.id}>
      {props.name}
    </option>
  )
}

export default class OutGo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categories :[]
    }
  }

  pullData(){
    getList((err,data)=>{
      console.log(data);
      if(err){
        console.log(err)
        return
      }
      else{
        for(item of data){
          this.state.categories.push(data)
        }
      }
    })

  }

  componentDidMount() {
    this.pullData();
  }
  render(){
    return(
      <div>
        <section>
          <CellsTitle>Description</CellsTitle>
          <Form>
            <FormCell>
              <CellBody>
                <TextArea placeholder="Enter Your Description" row="3" maxlength="200"></TextArea>
              </CellBody>
            </FormCell>
          </Form>
        </section>
        <section>
          <CellsTitle>Amount</CellsTitle>
          <Form>
            <FormCell>
              <CellHeader>
                <Label>$</Label>
              </CellHeader>
              <CellBody>
                <Input type="amount" placeholder="Outgo"  />
              </CellBody>
            </FormCell>
          </Form>
        </section>
        <section>
          <Form>
            <FormCell>
              <CellHeader>
                <Label>Date</Label>
              </CellHeader>
              <CellBody>
                <Input type="date" defaultValue=""/>
              </CellBody>
            </FormCell>
          </Form>
        </section>
        <section>
          <Form>
            <FormCell select>
              <CellBody>
                <Select>
                <option value="1">Botpress</option>
                </Select>
              </CellBody>
            </FormCell>
          </Form>
        </section>
        <section>
        <Button type="default" plain>Submit</Button>
        </section>
      </div>

    );
  }
}
