import React,{Component}from 'react';
import {Link} from 'react-router-dom';
import './ElectionDetails.css';
import UserNavbar from '../../components/UserNavbar';
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import UserHome from "../../components/UserHome";
import StartEnd from "../../components/StartEnd";
import ElectionStatus from "../../components/ElectionStatus";
import { useForm } from "react-hook-form";
import AdminNavbar from "../../components/UserNavbar"



export default class ElectionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      elStarted: false,
      elEnded: false,
      elDetails: {},
    };
  }

  // refreshing once
  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Get election start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ elStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ elEnded: end });

      // Getting election details from the contract
      const adminName = await this.state.ElectionInstance.methods
        .getAdminName()
        .call();
      const adminEmail = await this.state.ElectionInstance.methods
        .getAdminEmail()
        .call();
      const adminTitle = await this.state.ElectionInstance.methods
        .getAdminTitle()
        .call();
      const electionTitle = await this.state.ElectionInstance.methods
        .getElectionTitle()
        .call();
      const organizationTitle = await this.state.ElectionInstance.methods
        .getOrganizationTitle()
        .call();
      const idProof = await this.state.ElectionInstance.methods
        .getidProof()
        .call();

      this.setState({
        elDetails: {
          adminName: adminName,
          adminEmail: adminEmail,
          adminTitle: adminTitle,
          electionTitle: electionTitle,
          organizationTitle: organizationTitle,
          idProof: idProof
        },
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  // end election
  endElection = async () => {
    await this.state.ElectionInstance.methods
      .endElection()
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };
  // register and start election
  registerElection = async (data) => {
    await this.state.ElectionInstance.methods
      .setElectionDetails(
        data.adminFName.toLowerCase() + " " + data.adminLName.toLowerCase(),
        data.adminEmail.toLowerCase(),
        data.adminTitle.toLowerCase(),
        data.electionTitle.toLowerCase(),
        data.organizationTitle.toLowerCase(),
        data.idProof.toLowerCase()
      )
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          <UserNavbar />
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }
    return (
      <>
        {this.state.isAdmin ? <AdminNavbar /> : <UserNavbar />}
        <div className="container-main">
          {/*<div className="container-item center-items info">
            Your Account: {this.state.account}
          </div>*/}
          {!this.state.elStarted & !this.state.elEnded ? (
            <div className="container-item info">
              <center>
                <h3 style={{marginLeft:"630px"}}>The election has not been initialize.</h3>
                {this.state.isAdmin ? (
                  <p></p>
                ) : (
                  <p>Please wait..</p>
                )}
              </center>
            </div>
          ) : null}
        </div>
        {this.state.isAdmin ? (
          <>
            <this.renderAdminHome />
          </>
        ) : this.state.elStarted ? (
          <>
            <UserHome el={this.state.elDetails} />
          </>
        ) : !this.state.elStarted && this.state.elEnded ? (
          <>
            <div className="container-item attention">
              <center>
                <h3 style={{marginLeft:"690px"}}>The Election ended.</h3>
                </center>
                <br />
                <center>
                <Link
                  to="/Results"
                  style={{ color: "black", textDecoration: "underline" }}
                >
                  See results
                </Link>
              </center>
            </div>
          </>
        ) : null}
      </>
    );
  }

  renderAdminHome = () => {
    const EMsg = (props) => {
      return <span style={{ color: "tomato" }}>{props.msg}</span>;
    };

    const AdminHome = () => {
      // Contains of Home page for the Admin
      const {
        handleSubmit,
        register,
        formState: { errors },
      } = useForm();

      const onSubmit = (data) => {
        this.registerElection(data);
      };

      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!this.state.elStarted & !this.state.elEnded ? (
              <div className="container-main">
                {/* about-admin */}
              </div>
            ) : this.state.elStarted ? (
              <UserHome el={this.state.elDetails} />
            ) : null}
            </form>
        </div>
      );
    };
    return <AdminHome />;
  };
}