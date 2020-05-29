import React, {Component} from 'react'


class singleproject extends Component{ 
    render(){
        const queryString = require('query-string');

        const parsed = queryString.parse(this.props.location.search);
        return(
            <p>{parsed.code}</p>
        )
        // const search = new URLSearchParams(location.search);
        // const code = search.get('code')
        // return (
        //   <>
        //     <p>
        //       <strong>Match Props: </strong>
        //       <code>{JSON.stringify(match, null, 2)}</code>
        //     </p>
        //     <p>
        //       <strong>Location Props: </strong>
        //       <code>{code}</code>
        //     </p>
        //   </>
        // );
    }
}

  export default singleproject