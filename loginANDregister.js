const app = Vue.createApp({
  data() {
    return {
      // API
      apiUrl: "https://todoo.5xcamp.us",
      // headers.authorization
      token: "",
      // 前往頁面
      link: "#",
      // login & register
      email: "",
      emailError: false,
      password: "",
      passwordError: false,
      passwordAgain: "",
      passwordAgainError: false,
      userName: "",
      userNameError: false,
      // todoList
      myTodoName: "", // 用戶名稱
    };
  },
  methods: {
    // 登入
    login() {
      axios
        .post(`${this.apiUrl}/users/sign_in`, {
          user: {
            email: this.email,
            password: this.password,
          },
        })
        .then((res) => {
          this.token = res.headers.authorization;
          localStorage.setItem("myToken", this.token);
          this.myTodoName = res.data.nickname;
          localStorage.setItem("myName", this.myTodoName);
          console.log("登入成功", res, "myTodoName", this.myTodoName);
          this.link = "todolist.html";
          this.renderData();
        })
        .catch((err) => {
          alert(err.response.data.message), console.log(err.response);
        });
      const isMail =
        /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
      this.email === "" || !isMail.test(this.email)
        ? (this.emailError = true)
        : (this.emailError = false);
      this.password.length < 6
        ? (this.passwordError = true)
        : (this.passwordError = false);
    },
    // 註冊
    register() {
      axios
        .post(`${this.apiUrl}/users`, {
          user: {
            email: this.email,
            nickname: this.userName,
            password: this.password,
          },
        })
        .then((res) => {
          console.log("ok");
          console.log(res.data);
          this.link = "index.html";
          this.renderInput;
        })
        .catch((err) => {
          alert(err.response.data.message), console.log(err.response);
        });
      const isMail =
        /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
      this.email === "" || !isMail.test(this.email)
        ? (this.emailError = true)
        : (this.emailError = false);
      this.password.length < 6
        ? (this.passwordError = true)
        : (this.passwordError = false);
      this.passwordAgain === "" || this.passwordAgain != this.password
        ? (this.passwordAgainError = true)
        : (this.passwordAgainError = false);
      this.userName === ""
        ? (this.userNameError = true)
        : (this.userNameError = false);
    },
    // 渲染input
    renderInput() {
      this.email = "";
      this.password = "";
      this.passwordAgain = "";
      this.userName = "";
      this.emailError = false;
      this.passwordError = false;
      this.passwordAgainError = false;
      this.userNameError = false;
    },
  },
  computed: {
    // 讀取data的值：讀取資料，並篩選符合條件後，再重新渲染在畫面！！
    filterData() {
      if (this.currentTab === "已完成") {
        return (this.selectData = this.allData.filter((item) => {
          return item.completed_at !== null;
        }));
      } else if (this.currentTab === "待完成") {
        return (this.selectData = this.allData.filter((item) => {
          return item.completed_at === null;
        }));
      } else {
        return (this.selectData = this.allData);
      }
    },
    workData() {
      return this.allData.filter((item) => {
        return item.completed_at === null;
      });
    },
    doneData() {
      return this.allData.filter((item) => {
        return item.completed_at !== null;
      });
    },
  },
  watch: {
    // 監聽 email
    email() {
      const isMail =
        /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
      if (!isMail.test(this.email) || this.email === "") {
        this.emailError = true;
      } else {
        this.emailError = false;
      }
    },
    // 監聽 密碼
    password() {
      if (this.password.length < 6) {
        if (this.password === "") {
          this.passwordError = true;
        }
      } else {
        this.passwordError = false;
      }
    },
    // 監聽 再次輸入密碼
    passwordAgain() {
      if (this.passwordAgain != this.password) {
        if (this.passwordAgain === "") {
          this.passwordAgainError = true;
        }
      } else {
        this.passwordAgainError = false;
      }
    },
    // 監聽 使用者名稱
    userName() {
      if (this.userName === "") {
        this.userNameError = true;
      } else {
        this.userNameError = false;
      }
    },
  },
});
app.mount("#app");
