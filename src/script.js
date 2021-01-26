$(function () {
  const authorization = $(".authorization");
  const account = $(".header__content-account");
  const exit = $(".exit");

  authorization.hide();

  account.on("click", function () {
    authorization.show(600);
  });

  exit.on("click", function () {
    authorization.hide(600);
  });
});
