import { CommonModule } from '@angular/common';
import {
  NgModule,
  ModuleWithProviders,
  ANALYZE_FOR_ENTRY_COMPONENTS
} from '@angular/core';
import { provideRoutes, Routes, RouterModule } from '@angular/router';
import { CancelDirective } from './guest/cancel.directive';
import { FinishDirective } from './guest/finish.directive';
import { GuestComponent } from './guest/guest.component';
import { HostDirective } from './host/host.directive';
import { MessageService } from './message/message.service';
import { UrlSerializer } from './url/url-serializer.service';
import { IframeUrlResolver } from './url/iframe-url-resolver.service';
import {
  provideEntries,
  Entry,
  ReframeOptions,
  REFRAME_OPTIONS_DEFAULTS,
  provideReframeOptions
} from './reframe.interfaces';

const COMMON_PROVIDERS = [MessageService, UrlSerializer];

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [GuestComponent, CancelDirective, FinishDirective],
  exports: [GuestComponent, CancelDirective, FinishDirective]
})
export class ReframeGuestModule {}

@NgModule({
  imports: [CommonModule],
  declarations: [HostDirective],
  exports: [HostDirective]
})
export class ReframeHostModule {}

@NgModule({
  imports: [CommonModule]
})
export class ReframeModule {
  public static forHost(options?: ReframeOptions): ModuleWithProviders {
    return {
      ngModule: ReframeHostModule,
      providers: [
        ...COMMON_PROVIDERS,
        IframeUrlResolver,
        provideReframeOptions(options || REFRAME_OPTIONS_DEFAULTS)
      ]
    };
  }

  public static forGuest(entries?: Entry[]): ModuleWithProviders {
    return {
      ngModule: ReframeGuestModule,
      providers: [
        provideEntries(entries),
        provideRoutes([
          {
            path: 'external',
            children: [
              {
                path: '**',
                component: GuestComponent
              }
            ]
          }
        ])
      ]
    };
  }
}
