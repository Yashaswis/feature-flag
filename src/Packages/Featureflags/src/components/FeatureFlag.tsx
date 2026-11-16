
import {
  FeatureFlag as OpenFeatureFlag,
} from "@openfeature/react-sdk";

import type { ComponentProps } from "react";

export type FeatureFlagProps = ComponentProps<
  typeof OpenFeatureFlag
>;

export function FeatureFlag(props: FeatureFlagProps) {
  return <OpenFeatureFlag {...props} />;
}
