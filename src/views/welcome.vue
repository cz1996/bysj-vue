<template>
    <div class="index">
        <div id="index_pc_bj">
            <Form ref="formLogin" :model="formLogin" :rules="ruleLogin">
                <div class="wrap_conter">
                    <ul>
                        <li><h2>用户登录</h2></li>
                        <li>
                            <div class="name-password-error" v-if="this.$store.state.ifSign">用户名或密码错误</div>
                            <dl>
                                <FormItem prop="userName" >
                                    <Input v-model="formLogin.userName" type="text" placeholder="登录名" >
                                        <Icon type="ios-person-outline" slot="prepend" ></Icon>
                                    </Input>
                                </FormItem>
                                <FormItem prop="password">
                                    <Input v-model="formLogin.password" type="password" placeholder="密码" >
                                    <Icon type="ios-locked-outline" slot="prepend"></Icon></Input>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="login('formLogin')" style="width: 250px">登录</Button>
                                </FormItem>
                            </dl>
                        </li>
                    </ul>
                </div>
            </Form>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                formLogin:{
                    userName: 111,
                    password: 222
                },
                ruleLogin: {
                        userName: [
                            { required: true, message: '请填写用户名', trigger: 'blur' }
                        ],
                        password: [
                            { required: true, message: '请填写密码', trigger: 'blur' },
                        ]
                }
            }
        },
    };
</script>