import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-awesome-modal';
import axios from 'axios';

class App extends Component {

  state = {
    expenses: [],
    total: 0,
    modal: false,
    addModal: false,
    newTitle: '',
    newAuthor: '',
    newCOST: '',
    editTitle: '',
    editAuthor: '',
    editCOST: '',
    editID: '',
    dataLoading: false
  };

  componentDidMount() {
    this.fetchAllExpenses()
  }

  renderExpensesList() {
    console.log(this.state.total)
    return this.state.expenses.map(items => {
      return (
        <React.Fragment>
          <tr key={items._id}>
            <td><Link to={`/show/${items._id}`}>{items.cost}</Link></td>
            <td>{items.title}</td>
            <td>{items.author}</td>
            <td style={{width:"175px"}}><button className="btn btn-info" onClick={() => this.openModal(items._id, items.cost, items.title, items.author)} >EDIT</button> <button className="btn btn-danger" onClick={() => this.deleteExpense(items._id)}>DELETE</button></td>
          </tr>
        </React.Fragment>
      )
    })
  }

  openModal(id, cost, title, author) {
    console.log('Open Modal')
    this.setState({
      modal : true,
      editID: id,
      editTitle: title,
      editAuthor: author,
      editCOST: cost
    });

  }

  closeModal() {
    console.log('Close Modal')
    this.setState({
      modal : false
    });
  }

  openAddModal(id, cost, title, author) {
    console.log('Open Modal')
    this.setState({
      addModal : true
    });

  }

  closeAddModal() {
    console.log('Close Modal')
    this.setState({
      addModal : false
    });
  }


  fetchAllExpenses() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.get('http://localhost:5000/api/expense')
      .then(res => {
        this.setState({ expenses: res.data }, () => {
          this.sumCost(this.state.expenses)
        });
        console.log(this.state.expenses);
      })
      .catch((error) => {
        if(error.response.status === 401) {
          this.props.history.push("/login");
        }
      });
  }
  
   // to find total
  sumCost(data) {
    let sum = 0;
    data.map(items => {      
      sum += parseInt(items.cost);
    })
    this.setState({
      total: sum,
      dataLoading: true
    })
    console.log(this.state.total)
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  }

  createExpense = (event) => {
    event.preventDefault();
    const expensedata = {
      title: this.state.newTitle,
      author: this.state.newAuthor,
      cost: this.state.newCOST
    }
    axios.post('http://localhost:5000/api/expense', expensedata)
    this.fetchAllExpenses();
    this.setState({ newTitle: '', newAuthor: '', newCOST: '' })
    this.closeAddModal();
    this.fetchAllExpenses();
  }

  updateExpense = (event) => {
    event.preventDefault();
    const expenseData = {
      title: this.state.editTitle,
      author: this.state.editAuthor,
      cost: this.state.editCOST,
      id: this.state.editID
    }
    axios.put('http://localhost:5000/api/expense', expenseData)
    this.closeModal();
    this.setState({ editTitle: '', editAuthor: '', editCOST: '' })
    this.fetchAllExpenses();
  }

  deleteExpense = async (id) => {
    console.log({id})
    console.log('Delete clicked')
    await axios.delete('http://localhost:5000/api/expense/', { data: { id: id } })
    this.fetchAllExpenses()
  }

  handleTitleChange = (event) => {
    this.setState({ newTitle: event.target.value });
  };

  handleAuthorChange = (event) => {
    this.setState({ newAuthor: event.target.value });
  };

  handleCOSTChange = (event) => {
    this.setState({ newCOST: event.target.value });
  };

  handleEditTitleChange = (event) => {
    this.setState({ editTitle: event.target.value });
  };

  handleEditAuthorChange = (event) => {
    this.setState({ editAuthor: event.target.value });
  };

  handleEditCOSTChange = (event) => {
    this.setState({ editCOST: event.target.value });
  };
  handleTotal() {
    console.log("Total is", this.state.total)
    return (
      <React.Fragment>
        
      </React.Fragment>
    )
  }

  render() {
    const { dataLoading, total } = this.state;
    return (
      <div className="container">
        <Modal 
            visible={this.state.modal}
            width="550"
            height="375"
            effect="fadeInUp"
            onClickAway={() => this.closeModal()}
        >
          <div className="container">
              <h1>Edit Expense</h1>
              <form onSubmit={this.updateExpense}>
              Title:<br />
              <input class="form-control" type="text" onChange={this.handleEditTitleChange} name="title" value={this.state.editTitle} placeholder="Walt Disney Collection"/>
              <br />
              Author:<br />
              <input type="text" class="form-control" onChange={this.handleEditAuthorChange} name="author" value={this.state.editAuthor} placeholder="Mickey Mouse"/>
              <br/>
              COST:<br />
              <input type="text" class="form-control" onChange={this.handleEditCOSTChange} name="author" value={this.state.editCOST} placeholder="573058653"/>
              <br/>
              <div>
              <input className="btn btn-info" type="submit" value="Update Expense" />
              <button className="btn btn-danger float-right" onClick={() => this.closeModal()}>Close</button>
              </div>
            </form> 
          </div>
        </Modal>


        <Modal 
            visible={this.state.addModal}
            width="550"
            height="375"
            effect="fadeInUp"
            onClickAway={() => this.closeAddModal()}
        >
          <div className="container">
              <h1>Add Expense</h1>
              <form onSubmit={this.createExpense}>
              Title:<br />
              <input type="text" class="form-control" onChange={this.handleTitleChange} name="title" value={this.state.newTitle} placeholder="Walt Disney Collection"/>
              Author:<br />
              <input type="text" class="form-control" onChange={this.handleAuthorChange} name="author" value={this.state.newAuthor} placeholder="Mickey Mouse"/>
              COST:<br />
              <input type="text" class="form-control" onChange={this.handleCOSTChange} name="author" value={this.state.newCOST} placeholder="573058653"/>
              <input className="btn btn-success" type="submit" value="Create Expense" />
            </form> 
          </div>
        </Modal>



        <div className="panel panel-default">
          <div className="mb-5 panel-heading">
            <h3 className="panel-title">
              Expense Catalog &nbsp;
              {localStorage.getItem('jwtToken') &&
                <button className="btn btn-primary float-right" onClick={this.logout}>Logout</button>
              }
              <button onClick={() => this.openAddModal()} className="btn btn-success float-right mr-2">Add Expense</button>
            </h3>
          </div>
          <div className="panel-body">
            <table className="table table-stripe">
              <thead>
                <tr>
                  <th>COST</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dataLoading && this.renderExpensesList()}
                <tr>
                  <td>
                    Total: {total}
                  </td>
                </tr>
              </tbody>
            </table>
            
          </div>
        </div>
      </div>
    );
  }
}

export default App;
