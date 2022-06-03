const app = Vue.createApp({
  data() {
    return {
      // API
      apiUrl: "https://todoo.5xcamp.us",
      // headers.authorization
      token: "",
      // 前往頁面
      link: "#",
      // todoList
      myTodoName: "", // 用戶名稱
      currentTab: "全部",
      tabs: ["全部", "待完成", "已完成"],
      newTodo: "", // input.value
      allData: [], // 存放所有資料
      selectData: [], // 存放篩選資料
      deleteData: [], // 存放已完成且要全部刪除的資料
    };
  },
  methods: {
    // 渲染todo頁面的data值
    renderData() {
      axios
        .get(`${this.apiUrl}/todos`, {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          this.allData = res.data.todos;
          // 原本寫在這裡，但因為每次都會更新renderData因此會一直重複賦予值，所以就試著改放在deleteAll上，就可以正常運作了
          // this.doneData.forEach((item) => {
          //   this.deleteData.push(item.id);
          // });
          localStorage.getItem("myName")
          console.log("getDone", res, this.deleteData, this.doneData);
        })
        .catch((err) => console.log("get", err.response));
    },
    // 新增todo
    addList() {
      if (this.newTodo === "") {
        return alert("記得輸入一些東西唷！");
      }
      axios
        .post(`${this.apiUrl}/todos`, {
          todo: {
            content: this.newTodo,
          },
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          this.allData.unshift(res.data);
          this.renderData();
          console.log(res.data, "this.allData", this.allData);
        })
        .catch((err) => console.log("尚未登入", err.response));

      this.newTodo = "";
      this.currentTab = "全部";
    },
    // checked todo
    checkTodo(id) {
      axios
        .patch(`${this.apiUrl}/todos/${id}/toggle`, {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          // 使用this.allData = res.data;的話後面computed會出錯，原因在於因為res.data取到是目前的所點擊的，而非所有的data
          // this.allData = res.data;
          this.renderData();
          console.log(res, "all", this.allData);
        })
        .catch((err) => console.log(err.response));
    },
    // 刪除單筆 todo
    deleteList(id) {
      axios
        .delete(`${this.apiUrl}/todos/${id}`, {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          this.renderData();
          console.log(res, this.allData);
        })
        .catch((err) => console.log(err.response));
      this.currentTab = "全部";
    },
    // 刪除所有已完成 todo
    deleteAll() {
      this.doneData.forEach((item) => {
        this.deleteData.push(item.id);
      });
      this.renderData();
      Promise.all(this.deleteData)
        .then((res) => {
          console.log("deleteAll", res);
        })
        .catch((err) => console.log(err.response));
      for (let i = 0; i < this.deleteData.length; i++) {
        console.log(i);
        axios
          .delete(`${this.apiUrl}/todos/${this.deleteData[i]}`, {
            headers: {
              Authorization: this.token,
            },
          })
          .then((res) => {
            this.renderData();
            this.deleteData = [];
            console.log(res, this.allData);
          })
          .catch((err) => console.log(err.response));
      }
      this.currentTab = "全部";
    },
    // 登出
    logout() {
      axios
        .delete(`${this.apiUrl}/users/sign_out`, {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          console.log("logout", res);
          this.link = "index.html";
        })
        .catch((err) => console.log(err.response));
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
  created() {
    this.token = localStorage.getItem("myToken")
    this.myTodoName = localStorage.getItem("myName");
    // 目的是當進入到todolist時，會直接讀取資料
    this.renderData();
  },
});
app.mount("#app");
