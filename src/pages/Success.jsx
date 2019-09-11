import React from "react";
import { Result, Button } from "antd";

class Success extends React.Component {
  render() {
    return (
      <Result
        style={{ marginTop: "50px" }}
        status="success"
        title="Successfully Purchased"
        subTitle="Order number:  . Please check your bought items"
        extra={[
          <Button type="primary" key="console">
            <a href="http://localhost:3000">Go Home</a>
          </Button>
        ]}
      />
    );
  }
}

export default Success;
