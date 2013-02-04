var C = {
    property: 500,
    method: function() {
        return this.secondMethod();
    },
    secondMethod: function() {
        return this.property;
    }
}