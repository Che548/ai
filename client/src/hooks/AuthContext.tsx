import {
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
  createContext,
  useContext,
} from 'react';
import {
  TUser,
  TLoginResponse,
  setTokenHeader,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserQuery,
  useRefreshTokenMutation,
  TLoginUser,
} from 'librechat-data-provider';
import { useNavigate } from 'react-router-dom';

export type TAuthContext = {
  user: TUser | undefined;
  token: string | undefined;
  isAuthenticated: boolean;
  error: string | undefined;
  login: (data: TLoginUser) => void;
  logout: () => void;
};

export type TUserContext = {
  user?: TUser | undefined;
  token: string | undefined;
  isAuthenticated: boolean;
  redirect?: string;
};

export type TAuthConfig = {
  loginRedirect: string;
};
//@ts-ignore - index expression is not of type number
window['errorTimeout'] = undefined;
const AuthContext = createContext<TAuthContext | undefined>(undefined);

const AuthContextProvider = ({
  authConfig,
  children,
}: {
  authConfig?: TAuthConfig;
  children: ReactNode;
}) => {
  const [user, setUser] = useState<TUser | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const navigate = useNavigate();

  const loginUser = useLoginUserMutation();
  const logoutUser = useLogoutUserMutation();
  const userQuery = useGetUserQuery({ enabled: !!token });
  const refreshToken = useRefreshTokenMutation();

  // This seems to prevent the error flashing issue
  const doSetError = (error: string | undefined) => {
    if (error) {
      console.log(error);
      // set timeout to ensure we don't get a flash of the error message
      window['errorTimeout'] = setTimeout(() => {
        setError(error);
      }, 400);
    }
  };

  const setUserContext = useCallback(
    (userContext: TUserContext) => {
      const { token, isAuthenticated, user, redirect } = userContext;
      if (user) {
        setUser(user);
      }
      setToken(token);
      //@ts-ignore - ok for token to be undefined initially
      setTokenHeader(token);
      setIsAuthenticated(isAuthenticated);
      if (redirect) {
        navigate(redirect, { replace: true });
      }
    },
    [navigate],
  );

  type TResError = {
    response: { data: { message: string } };
    message: string;
  };

  const login = (data: TLoginUser) => {
    loginUser.mutate(data, {
      onSuccess: (data: TLoginResponse) => {
        const { user, token } = data;
        setUserContext({ token, isAuthenticated: true, user, redirect: '/chat/new' });
      },
      onError: (error: TResError | unknown) => {
        const resError = error as TResError;
        doSetError(resError.message);
        navigate('/login', { replace: true });
      },
    });
  };

  const logout = useCallback(() => {
    logoutUser.mutate(undefined, {
      onSuccess: () => {
        setUserContext({
          token: undefined,
          isAuthenticated: false,
          user: undefined,
          redirect: '/login',
        });
      },
      onError: (error) => {
        doSetError((error as Error).message);
        setUserContext({
          token: undefined,
          isAuthenticated: false,
          user: undefined,
          redirect: '/login',
        });
      },
    });
  }, [setUserContext, logoutUser]);

  const silentRefresh = useCallback(() => {
    refreshToken.mutate(undefined, {
      onSuccess: (data: TLoginResponse) => {
        const { user, token } = data;
        if (token) {
          setUserContext({ token, isAuthenticated: true, user });
        } else {
          console.log('Token is not present. User is not authenticated.');
          navigate('/login');
        }
      },
      onError: (error) => {
        console.log('refreshToken mutation error:', error);
        navigate('/login');
      },
    });
  }, []);

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    } else if (userQuery.isError) {
      doSetError((userQuery?.error as Error).message);
      navigate('/login', { replace: true });
    }
    if (error && isAuthenticated) {
      doSetError(undefined);
    }
    if (!token || !isAuthenticated) {
      silentRefresh();
    }
  }, [
    token,
    isAuthenticated,
    userQuery.data,
    userQuery.isError,
    userQuery.error,
    error,
    navigate,
    setUserContext,
  ]);

  useEffect(() => {
    const handleTokenUpdate = (event) => {
      console.log('tokenUpdated event received event');
      const newToken = event.detail;
      setUserContext({
        token: newToken,
        isAuthenticated: true,
        user: user,
      });
    };

    window.addEventListener('tokenUpdated', handleTokenUpdate);

    return () => {
      window.removeEventListener('tokenUpdated', handleTokenUpdate);
    };
  }, [setUserContext, user]);

  // Make the provider update only when it should
  const memoedValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      error,
      login,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, error, isAuthenticated, token],
  );

  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext should be used inside AuthProvider');
  }

  return context;
};

export { AuthContextProvider, useAuthContext };
