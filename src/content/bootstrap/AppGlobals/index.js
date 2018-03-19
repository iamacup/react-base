
import React from 'react';
import { connect } from 'react-redux';

class App extends React.Component {
  componentDidMount() {
    // do some stuff on the client to start the app
  }

  render() {
    return (
      <div />
    );
  }
}

// we have to bind the location to the state of this component so navigation updates work properly
// (i.e. so it detects a change in the location props and thus re renderds the app)
const mapStateToProps = state => ({
  location: state.router.location,
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(App);
