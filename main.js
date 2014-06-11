;(function(){
  var Game = React.createClass({
    render: function(){
      return React.DOM.table(null, this.renderContent());
    },

    currentPlayer: 0,

    getInitialState: function(){
      this.matrix = this.generateMatrix();
      return {
        matrix: this.matrix,
        players: ['x', 'y']
      }
    },

    generateMatrix: function(){
      var result = [];
      for(var i = 0; i < this.props.size; i++){
        var r = result[i] = [];
        for(var j = 0; j < this.props.size; j++){
          r.push([]);
        }
      }
      return result;
    },

    renderContent: function(){
      var result = [];
      for(var i = 0; i < this.props.size; i++){
        result.push(React.DOM.tr(null, this.renderCells(i)));
      }
      return result;
    },

    renderCells: function(y){
      var _this = this;
      var result = [];

      for(var i = 0; i < this.props.size; i++){
        (function(x){
          result.push(React.DOM.td({
            'data-y': y,
            'data-x': x,
            onClick: _this.clickHandler
          }, _this.state.matrix[y][x]));
        })(i);
      }
      return result;
    },

    togglePlayers: function(){
      this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    },

    clickHandler: function(e){
      var el = e.target;
      var x = el.getAttribute('data-x');
      var y = el.getAttribute('data-y');

      if(this.state.matrix[y][x].length){
        return;
      }

      this.matrix[y][x] = this.state.players[this.currentPlayer];
      this.setState({
        matrix: this.matrix
      });

      if(this.getWinner()){
        console.log('Winner');
        return;
      }
      this.togglePlayers();
    },

    getWinner: function(){
      var winner = false;
      var val = this.state.players[this.currentPlayer];

      winner = this.checkLines(val);
      if(!winner){
        winner = this.checkDiagonals(val);
      }

      return winner;
    },

    checkLines: function(val, vertical){
      var counter = 0;
      var result = false;

      for(var i = 0; i < this.props.size; i++){
        counter = 0;
        for(var j = 0; j < this.props.size; j++){
          if((vertical ? this.state.matrix[j][i] : this.state.matrix[i][j]) === val){
            counter++;
          }
        }
        if(counter === this.props.size){
          result = val;
        }
      }

      if(!vertical && !result){
        result = this.checkLines(val, true);
      }

      return result;
    },
    checkDiagonals: function(val, reverse){
      var counter = 0;
      var result = false;
      var max = this.props.size - 1;

      for(var i = 0; i < this.props.size; i++){
        if((reverse ? this.state.matrix[i][max - i] : this.state.matrix[i][i]) === val){
          counter++;
        }
      }
      if(counter === this.props.size){
        result = val;
      }

      if(!reverse && !result){
        result = this.checkDiagonals(val, true);
      }

      return result;
    }
  });

  React.renderComponent(Game({size: 4}), document.body);
})();