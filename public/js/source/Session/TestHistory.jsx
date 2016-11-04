var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({


    render: function () {

        var tableBody = this.props.results.map(function (result) {

            var finishedDate = new Date(result.performanceTest.finished).toLocaleString();
            return (

                <tr key={result._id}>
                    <td>
                        {finishedDate}
                    </td>
                      <td>
                          <a href={result.baselineTest.userUrl} target="_blank">{result.baselineTest.testId}</a>
                      </td>
                <td>{result.baselineTest.speedIndex}</td>

                    <td>
            <a href={result.performanceTest.userUrl} target="_blank">{result.performanceTest.testId}</a>
                    </td>
                <td>{result.performanceTest.speedIndex}</td>
                </tr>

                );
        });

        var table =  <table className="table table-hover">
                      <thead>
                      <tr>
                      <th rowSpan='2'>Test finished at</th>
                          <th colSpan='2'>Baseline Test</th>
                          <th colSpan='2'>Performance Test</th>
                      </tr>
                          <tr>
                          <th>Test result URL</th>
                           <th>Speed Index</th>
                          <th>Test result URL</th>
                               <th>Speed Index</th>
                          </tr>
                      </thead>
                         <tbody>{tableBody}</tbody>
                      </table>


                               var formInnerBlock;
        this.props.results[0] ? formInnerBlock = table : formInnerBlock = <p>No test results found.</p>;


        return (
             <form id="modal-form">
                  <div className="modal-body">
                      {formInnerBlock}
                      </div>
                <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>

                </div>
</form>
                )
    }
});
