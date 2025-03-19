(function() {
    'use strict';
  
    class CozeAuth {
        constructor({appId, keyId, privateKey}) {
          if (!appId || !keyId || !privateKey) {
            throw new Error('必须提供 appId, keyId 和 privateKey');
          }
          
          this.config = {
            baseURL: 'https://api.coze.cn',
            aud: 'api.coze.cn',
            appId,
            keyId,
            privateKey
          };
          
          // 内存缓存token
          this._tokenCache = null;
          
          // 加载jsrsasign库
          this._loadJsrsasign();
        }
        
        // 动态加载jsrsasign库
        _loadJsrsasign() {
          if (window.KJUR) return Promise.resolve();
          
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/10.5.27/jsrsasign-all-min.js';
            // 移除integrity属性，避免完整性验证失败
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = () => reject(new Error('加载jsrsasign库失败'));
            document.head.appendChild(script);
          });
        }
    
        async getValidToken() {
          if (this._isTokenValid()) {
            return this._tokenCache.access_token;
          }
          return this._refreshToken();
        }
    
        _isTokenValid() {
          return this._tokenCache?.access_token && 
            this._tokenCache.expires_at > Date.now() + 5000;
        }
    
        async _refreshToken() {
          const now = Math.floor(Date.now() / 1000);
          
          try {
            console.log('开始生成JWT...');
            const jwt = await this._signJWT({
              alg: 'RS256',
              typ: 'JWT',
              kid: this.config.keyId
            }, {
              iss: this.config.appId,
              aud: this.config.aud,
              iat: now,
              exp: now + 300,
              jti: this._generateJTI()
            });
    
            const response = await fetch(`${this.config.baseURL}/api/permission/oauth2/token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
              },
              body: JSON.stringify({grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer'})
            });

            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`认证失败: ${errorText}`);
            }
    
            const tokenData = await response.json();
            
            this._tokenCache = {
              access_token: tokenData.access_token,
              expires_at: Date.now() + tokenData.expires_in * 1000
            };
            
            return tokenData.access_token;
          } catch (error) {
            console.error('刷新token过程中发生错误:', error);
            throw error;
          }
        }
  
      _generateJTI() {
        // 使用随机数生成JTI，不依赖crypto API
        const randomChars = 'abcdef0123456789';
        let jti = '';
        for (let i = 0; i < 32; i++) {
          jti += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return jti;
      }
  
      async _signJWT(header, payload) {
        
        try {
          // 确保jsrsasign库已加载
          await this._loadJsrsasign();
          
          if (!window.KJUR) {
            throw new Error('jsrsasign库未加载成功');
          }
          
          const privateKey = await this.loadPrivateKey();
          
          // 使用jsrsasign库签名JWT
          const jws = KJUR.jws.JWS;
          const headerObj = header;
          const payloadObj = payload;
          
          // 创建JWT
          const jwt = jws.sign('RS256', headerObj, payloadObj, privateKey);
          console.log('JWT生成完成，长度:', jwt.length);
          return jwt;
        } catch (error) {
          console.error('JWT签名过程中发生错误:', error);
          throw error;
        }
      }
  
      async loadPrivateKey() {
        // 直接返回私钥字符串，jsrsasign可以直接使用PEM格式的私钥
        return this.config.privateKey;
      }
    }
  
    class CozeClient {
        constructor(authConfig) {
          this.auth = new CozeAuth(authConfig);
        }
    
        async swapFace(originalImageUrl, targetImageUrl) {
          // 获取有效的访问令牌
          const token = await this.auth.getValidToken();
          
          const requestBody = {
            workflow_id: "7482077514672652323",
            parameters: {
              base_img: originalImageUrl,
              face_img: targetImageUrl
            }
          };
          try {
            const response = await fetch('https://api.coze.cn/v1/workflow/run', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              
              body: JSON.stringify(requestBody)
            });
            
            // 处理响应
            const data = await response.json();
            
            if (data.code !== 0) {
              throw new Error(data.message || '换脸API调用失败');
            }
            
            // 解析data字段中的JSON字符串并返回完整的数据对象
            const resultData = JSON.parse(data.data);
            return resultData;
          } catch (error) {
            console.error('换脸处理异常:', error);
            throw error;
          }
        }    

      }
      
    
      // 暴露工厂函数供配置使用
      window.createCozeClient = (config) => new CozeClient(config);
    })();