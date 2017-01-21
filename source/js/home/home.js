let home = () => {

  return {
    init: () => {
      if ($('.wrapper').hasClass('home')){
        $('body').on('click', (e) => {
          e.preventDefault();
          console.log(e.target);

        })
      }
    }
  }
};

module.exports = home();