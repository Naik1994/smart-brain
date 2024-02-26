import React from 'react';

class SignIn extends React.Component {
    constructor() {
        super();
        this.state = {
            signInEmail: "",
            signInPassword: ""
        }
    }
    
    onEmailChange = (event) => {
        this.setState({ signInEmail: event.target.value });
    }

    onPasswordChange = (event) => {
        this.setState({ signInPassword: event.target.value });
    }

    onSubmit = async () => {
        try {
            const response = await fetch('http://ec2-13-126-178-22.ap-south-1.compute.amazonaws.com:3001/signin', {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({
                    email: this.state.signInEmail,
                    password: this.state.signInPassword
                })
            });

            const data = await response.json();
            if (data.id) {
                const response = await fetch(`http://ec2-13-126-178-22.ap-south-1.compute.amazonaws.com:3001/profile/${data.id}`);
                const userData = await response.json();
                this.props.updateProfile(userData);
                this.props.onRouteChange('home');
            }
        } catch (error) {
            console.log("error inside SignIn Componenet => ", error);
        }
    }

    render() {
        return (
            <article className="br3 ba b--black-20 mv4 w-100 w-50-m w-25-l mw20 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0 center">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="email" 
                                name="email-address"  
                                id="email-address"
                                onChange={this.onEmailChange}
                            />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input 
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="password" 
                                name="password"  
                                id="password" 
                                onChange={this.onPasswordChange}
                            />
                        </div>
                        </fieldset>
                        <div className="">
                            <input onClick={this.onSubmit} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in" />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={() => this.props.onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default SignIn;