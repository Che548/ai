import OpenAI from 'openai';
import type { InfiniteData } from '@tanstack/react-query';
import type {
  TMessage,
  TResPlugin,
  ImageDetail,
  TSharedLink,
  TConversation,
  EModelEndpoint,
  TConversationTag,
  TBanner,
} from './schemas';
import type { TSpecsConfig } from './models';
export type TOpenAIMessage = OpenAI.Chat.ChatCompletionMessageParam;
export type TOpenAIFunction = OpenAI.Chat.ChatCompletionCreateParams.Function;
export type TOpenAIFunctionCall = OpenAI.Chat.ChatCompletionCreateParams.FunctionCallOption;

export * from './schemas';

export type TMessages = TMessage[];

export type TMessagesAtom = TMessages | null;

/* TODO: Cleanup EndpointOption types */
export type TEndpointOption = {
  endpoint: EModelEndpoint;
  endpointType?: EModelEndpoint;
  modelDisplayLabel?: string;
  resendFiles?: boolean;
  promptCache?: boolean;
  maxContextTokens?: number;
  imageDetail?: ImageDetail;
  model?: string | null;
  promptPrefix?: string;
  temperature?: number;
  chatGptLabel?: string | null;
  modelLabel?: string | null;
  jailbreak?: boolean;
  key?: string | null;
  /* assistant */
  thread_id?: string;
  /* multi-response stream */
  overrideConvoId?: string;
  overrideUserMessageId?: string;
};

export type TPayload = Partial<TMessage> &
  Partial<TEndpointOption> & {
    isContinued: boolean;
    conversationId: string | null;
    messages?: TMessages;
  };

export type TSubmission = {
  artifacts?: string;
  plugin?: TResPlugin;
  plugins?: TResPlugin[];
  userMessage: TMessage;
  isEdited?: boolean;
  isContinued?: boolean;
  messages: TMessage[];
  isRegenerate?: boolean;
  conversationId?: string;
  initialResponse?: TMessage;
  conversation: Partial<TConversation>;
  endpointOption: TEndpointOption;
};

export type EventSubmission = Omit<TSubmission, 'initialResponse'> & { initialResponse: TMessage };

export type TPluginAction = {
  pluginKey: string;
  action: 'install' | 'uninstall';
  auth?: unknown;
  isAssistantTool?: boolean;
};

export type GroupedConversations = [key: string, TConversation[]][];

export type TUpdateUserPlugins = {
  isAssistantTool?: boolean;
  isAgentTool?: boolean;
  pluginKey: string;
  action: string;
  auth?: unknown;
};

export type TCategory = {
  id?: string;
  value: string;
  label: string;
};

export type TError = {
  message: string;
  code?: number | string;
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
};

export type TUser = {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  provider: string;
  plugins: string[];
  createdAt: string;
  updatedAt: string;
};

export type TGetConversationsResponse = {
  conversations: TConversation[];
  pageNumber: string;
  pageSize: string | number;
  pages: string | number;
};

export type TUpdateMessageRequest = {
  conversationId: string;
  messageId: string;
  model: string;
  text: string;
};

export type TUpdateMessageContent = {
  conversationId: string;
  messageId: string;
  index: number;
  text: string;
};

export type TUpdateUserKeyRequest = {
  name: string;
  value: string;
  expiresAt: string;
};

export type TUpdateConversationRequest = {
  conversationId: string;
  title: string;
};

export type TUpdateConversationResponse = TConversation;

export type TDeleteConversationRequest = {
  conversationId?: string;
  thread_id?: string;
  source?: string;
};

export type TDeleteConversationResponse = {
  acknowledged: boolean;
  deletedCount: number;
  messages: {
    acknowledged: boolean;
    deletedCount: number;
  };
};

export type TArchiveConversationRequest = {
  conversationId: string;
  isArchived: boolean;
};

export type TArchiveConversationResponse = TConversation;

export type TSharedMessagesResponse = Omit<TSharedLink, 'messages'> & {
  messages: TMessage[];
};
export type TSharedLinkRequest = Partial<
  Omit<TSharedLink, 'messages' | 'createdAt' | 'updatedAt'>
> & {
  conversationId: string;
};

export type TSharedLinkResponse = TSharedLink;
export type TSharedLinksResponse = TSharedLink[];
export type TDeleteSharedLinkResponse = TSharedLink;

// type for getting conversation tags
export type TConversationTagsResponse = TConversationTag[];
// type for creating conversation tag
export type TConversationTagRequest = Partial<
  Omit<TConversationTag, 'createdAt' | 'updatedAt' | 'count' | 'user'>
> & {
  conversationId?: string;
  addToConversation?: boolean;
};

export type TConversationTagResponse = TConversationTag;

// type for tagging conversation
export type TTagConversationRequest = {
  tags: string[];
};
export type TTagConversationResponse = string[];

export type TForkConvoRequest = {
  messageId: string;
  conversationId: string;
  option?: string;
  splitAtTarget?: boolean;
  latestMessageId?: string;
};

export type TForkConvoResponse = {
  conversation: TConversation;
  messages: TMessage[];
};

export type TSearchResults = {
  conversations: TConversation[];
  messages: TMessage[];
  pageNumber: string;
  pageSize: string | number;
  pages: string | number;
  filter: object;
};

export type TConfig = {
  order: number;
  type?: EModelEndpoint;
  azure?: boolean;
  availableTools?: [];
  availableRegions?: string[];
  plugins?: Record<string, string>;
  name?: string;
  iconURL?: string;
  version?: string;
  modelDisplayLabel?: string;
  userProvide?: boolean | null;
  userProvideURL?: boolean | null;
  disableBuilder?: boolean;
  retrievalModels?: string[];
  capabilities?: string[];
};

export type TEndpointsConfig =
  | Record<EModelEndpoint | string, TConfig | null | undefined>
  | undefined;

export type TModelsConfig = Record<string, string[]>;

export type TUpdateTokenCountResponse = {
  count: number;
};

export type TMessageTreeNode = object;

export type TSearchMessage = object;

export type TSearchMessageTreeNode = object;

export type TRegisterUserResponse = {
  message: string;
};

export type TRegisterUser = {
  name: string;
  email: string;
  username: string;
  password: string;
  confirm_password?: string;
  token?: string;
};

export type TLoginUser = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  token: string;
  user: TUser;
};

export type TRequestPasswordReset = {
  email: string;
};

export type TResetPassword = {
  userId: string;
  token: string;
  password: string;
  confirm_password?: string;
};

export type VerifyEmailResponse = { message: string };

export type TVerifyEmail = {
  email: string;
  token: string;
};

export type TResendVerificationEmail = Omit<TVerifyEmail, 'token'>;

export type TInterfaceConfig = {
  privacyPolicy?: {
    externalUrl?: string;
    openNewTab?: boolean;
  };
  termsOfService?: {
    externalUrl?: string;
    openNewTab?: boolean;
    modalAcceptance?: boolean;
    modalTitle?: string;
    modalContent?: string;
  };
  endpointsMenu: boolean;
  modelSelect: boolean;
  parameters: boolean;
  sidePanel: boolean;
  presets: boolean;
  multiConvo: boolean;
  bookmarks: boolean;
  prompts: boolean;
};

export type TStartupConfig = {
  appTitle: string;
  socialLogins?: string[];
  interface?: TInterfaceConfig;
  discordLoginEnabled: boolean;
  facebookLoginEnabled: boolean;
  githubLoginEnabled: boolean;
  googleLoginEnabled: boolean;
  openidLoginEnabled: boolean;
  openidLabel: string;
  openidImageUrl: string;
  /** LDAP Auth Configuration */
  ldap?: {
    /** LDAP enabled */
    enabled: boolean;
    /** Whether LDAP uses username vs. email */
    username?: boolean;
  };
  serverDomain: string;
  emailLoginEnabled: boolean;
  registrationEnabled: boolean;
  socialLoginEnabled: boolean;
  passwordResetEnabled: boolean;
  emailEnabled: boolean;
  checkBalance: boolean;
  showBirthdayIcon: boolean;
  helpAndFaqURL: string;
  customFooter?: string;
  modelSpecs?: TSpecsConfig;
  sharedLinksEnabled: boolean;
  publicSharedLinksEnabled: boolean;
  analyticsGtmId?: string;
  instanceProjectId: string;
};

export type TRefreshTokenResponse = {
  token: string;
  user: TUser;
};

export type TCheckUserKeyResponse = {
  expiresAt: string;
};

export type TRequestPasswordResetResponse = {
  link?: string;
  message?: string;
};

/**
 * Represents the response from the import endpoint.
 */
export type TImportResponse = {
  /**
   * The message associated with the response.
   */
  message: string;
};

/** Prompts */

export type TPrompt = {
  groupId: string;
  author: string;
  prompt: string;
  type: 'text' | 'chat';
  createdAt: string;
  updatedAt: string;
  _id?: string;
};

export type TPromptGroup = {
  name: string;
  numberOfGenerations?: number;
  command?: string;
  oneliner?: string;
  category?: string;
  projectIds?: string[];
  productionId?: string | null;
  productionPrompt?: Pick<TPrompt, 'prompt'> | null;
  author: string;
  authorName: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
};

export type TCreatePrompt = {
  prompt: Pick<TPrompt, 'prompt' | 'type'> & { groupId?: string };
  group?: { name: string; category?: string; oneliner?: string; command?: string };
};

export type TCreatePromptRecord = TCreatePrompt & Pick<TPromptGroup, 'author' | 'authorName'>;

export type TPromptsWithFilterRequest = {
  groupId: string;
  tags?: string[];
  projectId?: string;
  version?: number;
};

export type TPromptGroupsWithFilterRequest = {
  category: string;
  pageNumber: string;
  pageSize: string | number;
  before?: string | null;
  after?: string | null;
  order?: 'asc' | 'desc';
  name?: string;
  author?: string;
};

export type PromptGroupListResponse = {
  promptGroups: TPromptGroup[];
  pageNumber: string;
  pageSize: string | number;
  pages: string | number;
};

export type PromptGroupListData = InfiniteData<PromptGroupListResponse>;

export type TCreatePromptResponse = {
  prompt: TPrompt;
  group?: TPromptGroup;
};

export type TUpdatePromptGroupPayload = Partial<TPromptGroup> & {
  removeProjectIds?: string[];
};

export type TUpdatePromptGroupVariables = {
  id: string;
  payload: TUpdatePromptGroupPayload;
};

export type TUpdatePromptGroupResponse = TPromptGroup;

export type TDeletePromptResponse = {
  prompt: string;
  promptGroup?: { message: string; id: string };
};

export type TDeletePromptVariables = {
  _id: string;
  groupId: string;
};

export type TMakePromptProductionResponse = {
  message: string;
};

export type TMakePromptProductionRequest = {
  id: string;
  groupId: string;
  productionPrompt: Pick<TPrompt, 'prompt'>;
};

export type TUpdatePromptLabelsRequest = {
  id: string;
  payload: {
    labels: string[];
  };
};

export type TUpdatePromptLabelsResponse = {
  message: string;
};

export type TDeletePromptGroupResponse = {
  promptGroup: string;
};

export type TDeletePromptGroupRequest = {
  id: string;
};

export type TGetCategoriesResponse = TCategory[];

export type TGetRandomPromptsResponse = {
  prompts: TPromptGroup[];
};

export type TGetRandomPromptsRequest = {
  limit: number;
  skip: number;
};

export type TCustomConfigSpeechResponse = { [key: string]: string };

export type TUserTermsResponse = {
  termsAccepted: boolean;
};

export type TAcceptTermsResponse = {
  success: boolean;
};

export type TBannerResponse = TBanner | null;

// Subscription Plan Type
export type TSubscriptionPlan = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  durationInDays: number;
  tokenCredits: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  features: string[];
};

// Create Subscription Plan Payload
export type TCreateSubscriptionPlan = {
  name: string;
  description?: string;
  price: number;
  durationInDays: number;
  tokenCredits: number;
  isActive?: boolean;
};

// Update Subscription Plan Payload
export type TUpdateSubscriptionPlan = Partial<TCreateSubscriptionPlan>;

// Payment Gateway Request Type
export type TPaymentGatewayRequest = {
  amount: number; // Payment amount
  currency: string; // Currency code, e.g., 'USD', 'EUR', 'IRR'
  description: string; // Description of the payment or product/service
  userId: string; // ID of the user making the payment
  callbackUrl: string; // URL to redirect after payment is completed
};

// Payment Gateway Response Type (for redirection)
export type TPaymentGatewayResponse = {
  redirectUrl: string; // URL to redirect the client to the payment gateway
  paymentId: string; // Unique payment ID from the client system
};

// Payment Verification Request Type
export type TPaymentVerificationRequest = {
  paymentId: string; // Unique payment ID generated when the payment was created
  authorityCode: string; // Unique code or token provided by the gateway for verification
};

// Payment Verification Response Type
export type TPaymentVerificationResponse = {
  isSuccess: boolean; // Whether the payment was successfully verified
  transactionId?: string; // Unique transaction ID if payment is successful
  amount?: number; // Confirmed amount of the payment
  currency?: string; // Currency in which payment was made
  message?: string; // Optional message about the verification result
};
// In `types.ts`

export type TPaymentRequest = {
  amount: number;
  callbackUrl: string;
  description: string;
  email?: string;
  mobile?: string;
};

export type TPaymentResponse = {
  paymentUrl: string; // URL to which the client should redirect
  authority: string;  // Unique identifier for the payment
};

export type TVerifyPaymentRequest = {
  authority: string;  // Authority code from the payment gateway
  amount: number;     // Amount of the transaction
};

export type TVerifyPaymentResponse = {
  status: string;     // Status of the transaction
  refId: string;      // Reference ID from the payment provider
  success: boolean;
};

// types.ts

export type TBuySubscriptionRequest = {
  userId: string;
  planId: string;
};

export type TBuySubscriptionResponse = {
  success: boolean;
  url?: string; // URL to redirect the user to the payment gateway
  authority?: string;
};

// Add the TPaymentHistory type for user's payment history
export type TPaymentHistoryItem = {
  transactionId: string;       // Unique transaction ID
  userId: string;               // ID of the user who made the payment
  subscriptionPlanId?: string;  // ID of the subscription plan (if applicable)
  amount: number;               // Amount paid
  status: 'pending' | 'paid' | 'failed'; // Status of the payment
  refId?: string;               // Reference ID from the payment provider
  createdAt: string;            // Date and time of payment creation
  updatedAt?: string;           // Date and time of payment update
  provider: string;             // Payment provider, e.g., 'zarinpal'
};

// The payment history type is an array of payment history items
export type TPaymentHistory = TPaymentHistoryItem[];

export type TPaymentHistoryResponse = {
  message: string,
  payments: TPaymentHistory,
};

// Update TBalance type to include subscription plan information
export type TBalance = {
  balance: number;
  subscription?: TSubscriptionPlan;
};

