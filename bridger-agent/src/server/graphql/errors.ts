import { GraphQLError } from "graphql";

// Error codes returned in `extensions.code` so the UI can tell failures apart.
export const WriteErrorCode = {
  NOT_FOUND: "NOT_FOUND",
  INVALID_STATE: "INVALID_STATE",
  INVALID_INPUT: "INVALID_INPUT",
} as const;

type WriteErrorCode = (typeof WriteErrorCode)[keyof typeof WriteErrorCode];

// Builds a GraphQL error that is shown to the client (not masked) with a stable code.
export function writeError(code: WriteErrorCode, message: string): GraphQLError {
  return new GraphQLError(message, { extensions: { code } });
}
