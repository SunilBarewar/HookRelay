import { getEndpointUrlError } from "@/lib/endpoint-url.ts";
import {
  CreateEndpointBody as BaseCreateEndpointBody,
  EndpointUrl,
  UpdateEndpointBody as BaseUpdateEndpointBody,
} from "@hookrelay/shared/schemas";

/** The shared URL rule plus the environment-dependent one: https only, no private hosts, in production. */
const CheckedEndpointUrl = EndpointUrl.superRefine((value, ctx) => {
  const message = getEndpointUrlError(value);
  if (message) ctx.addIssue({ code: "custom", message });
});

export const CreateEndpointBody = BaseCreateEndpointBody.extend({ url: CheckedEndpointUrl });

export const UpdateEndpointBody = BaseUpdateEndpointBody.safeExtend({
  url: CheckedEndpointUrl.optional(),
});
