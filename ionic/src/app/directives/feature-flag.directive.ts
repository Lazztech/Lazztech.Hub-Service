import { Directive, Input, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NGXLogger } from 'ngx-logger';

@Directive({
  selector: '[appFeatureFlag]'
})
export class FeatureFlagDirective {
  @Input() appFeatureFlag: string;

  constructor(
    private el: ElementRef,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    this.logger.log(`Checking feature flag for "${this.appFeatureFlag}"`);
    if (!this.feature(this.appFeatureFlag)) {
      this.logger.log(`Hiding feature "${this.appFeatureFlag}"`);
      this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
    } else {
      this.logger.log(`Not hiding feature "${this.appFeatureFlag}"`);
    }
  }

  feature(feature: string) {
    this.logger.log('Feature flags:', environment.featureFlags);
    const enabled = environment.featureFlags[`${feature}`];
    this.logger.log(`Feature "${feature}" is: ${enabled}`);
    return enabled;
  }

}
