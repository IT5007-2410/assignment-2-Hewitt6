const initialTravellers = [
  {
    id: 1,
    name: 'Jack',
    phone: '88885555',
    email: 'jack@example.com',
    seatNumber: 1,
    bookingTime: new Date(),
  },
  {
    id: 2,
    name: 'Rose',
    phone: '88884444',
    email: 'rose@example.com',
    seatNumber: 2,
    bookingTime: new Date(),
  },
];

function TravellerRow(props) {
  const { traveller } = props;
  return (
    <tr>
      <td>{traveller.id}</td>
      <td>{traveller.name}</td>
      <td>{traveller.phone}</td>
      <td>{traveller.email}</td>
      <td>{traveller.seatNumber}</td>
      <td>{traveller.bookingTime.toString()}</td>
    </tr>
  );
}

function Display(props) {
  const travellerRows = props.travellers.map((traveller) => (
    <TravellerRow key={traveller.id} traveller={traveller} />
  ));
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Seat Number</th>
          <th>Booking Time</th>
        </tr>
      </thead>
      <tbody>{travellerRows}</tbody>
    </table>
  );
}

class Add extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.addTraveller;
    const newTraveller = {
      name: form.travellername.value,
      phone: form.phone.value,
      email: form.email.value,
      seatNumber: Number(form.seatNumber.value), // Ensure it's a number
    };
    this.props.bookTraveller(newTraveller);
    form.travellername.value = "";
    form.phone.value = "";
    form.email.value = "";
    form.seatNumber.value = "";
  }

  render() {
    return (
      <form name="addTraveller" onSubmit={this.handleSubmit}>
        <input type="text" name="travellername" placeholder="Name" required />
        <input type="text" name="phone" placeholder="Phone" required />
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="number"
          name="seatNumber"
          placeholder="Seat Number"
          required
          min="1"
        />
        <button>Add</button>
      </form>
    );
  }
}

class Delete extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.deleteTraveller;
    const travellerId = Number(form.travellerId.value);
    this.props.delfunction(travellerId);
    form.travellerId.value = "";
  }

  render() {
    return (
      <form name="deleteTraveller" onSubmit={this.handleSubmit}>
        <input
          type="number"
          name="travellerId"
          placeholder="Traveller ID"
          required
        />
        <button>Delete</button>
      </form>
    );
  }
}

class Homepage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <div className="seats-container">
          {[...Array(10)].map((_, index) => {
            const occupied = this.props.travellers.some(
              (traveller) => traveller.seatNumber === index + 1
            );
            return (
              <button
                key={index}
                className={occupied ? 'seat occupied' : 'seat free'}
              >
                {occupied ? 'X' : 'O'}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

class TicketToRide extends React.Component {
  constructor() {
    super();
    this.state = { travellers: [], selector: 1 };
    this.bookTraveller = this.bookTraveller.bind(this);
    this.deleteTraveller = this.deleteTraveller.bind(this);
  }

  setSelector(value) {
    this.setState({ selector: value });
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      this.setState({ travellers: initialTravellers });
    }, 500);
  }

  bookTraveller(passenger) {
    /* Q4. Add a passenger to the traveller state variable with proper id and seatNumber */
    this.setState((prevState) => ({
      travellers: [
        ...prevState.travellers,
        {
          ...passenger,
          id: prevState.travellers.length
            ? Math.max(...prevState.travellers.map((t) => t.id)) + 1
            : 1, // Ensure unique ID
          bookingTime: new Date(),
        },
      ],
    }));
  }

  deleteTraveller(travellerId) {
    /* Q5. Delete a passenger based on ID */
    console.log("deleteTraveller", travellerId);
    const newList = this.state.travellers.filter(
      (element) => element.id !== travellerId
    );
    this.setState({ travellers: newList });
  }

  render() {
    return (
      <div>
        <h1>Ticket To Ride</h1>
        <div>
          {/* Navigation bar */}
          <button onClick={() => this.setSelector(1)}>Home</button>
          <button onClick={() => this.setSelector(2)}>Display Travellers</button>
          <button onClick={() => this.setSelector(3)}>Add Traveller</button>
          <button onClick={() => this.setSelector(4)}>Delete Traveller</button>
        </div>
        <div>
          {/* Conditional rendering */}
          {this.state.selector === 1 && (
            <Homepage travellers={this.state.travellers} />
          )}
          {this.state.selector === 2 && (
            <Display travellers={this.state.travellers} />
          )}
          {this.state.selector === 3 && (
            <Add
              bookTraveller={this.bookTraveller}
              travellers={this.state.travellers} // Pass travellers as a prop
            />
          )}
          {this.state.selector === 4 && (
            <Delete delfunction={this.deleteTraveller} />
          )}
        </div>
      </div>
    );
  }
}

const element = <TicketToRide />;

ReactDOM.render(element, document.getElementById('contents'));
