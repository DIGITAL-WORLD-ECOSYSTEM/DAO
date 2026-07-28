import os

fixes = {
    "src/sections/blog/_components/PostFeatured.tsx": [
        (
            '            direction="row"\n            alignItems="center"\n            spacing={1.5}\n            sx={{',
            '            direction="row"\n            spacing={1.5}\n            sx={{\n              alignItems: "center",'
        ),
        (
            '          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: \'auto\' }}>',
            '          <Stack direction="row" spacing={2} sx={{ mt: \'auto\', alignItems: \'center\' }}>'
        )
    ],
    "src/sections/blog/_components/PostSearch.tsx": [
        (
            '          InputProps={{\n            ...params.InputProps,\n            startAdornment: (\n              <InputAdornment position="start">\n                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: \'text.disabled\' }} />\n              </InputAdornment>\n            ),\n          }}',
            '          slotProps={{\n            input: {\n              ...params.InputProps,\n              startAdornment: (\n                <InputAdornment position="start">\n                  <Iconify icon="eva:search-fill" sx={{ ml: 1, color: \'text.disabled\' }} />\n                </InputAdornment>\n              ),\n            }\n          }}'
        )
    ],
    "src/sections/blog/_components/PostVideo.tsx": [
        (
            '        <Stack\n          alignItems="center"\n          justifyContent="center"\n          sx={{',
            '        <Stack\n          sx={{\n            alignItems: "center",\n            justifyContent: "center",'
        ),
        (
            '        <Stack direction="row" alignItems="center" spacing={1}>',
            '        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>'
        )
    ],
    "src/sections/blog/_forms/PostNewsletter.tsx": [
        (
            '      <Stack\n        spacing={3}\n        alignItems="center"\n        sx={{',
            '      <Stack\n        spacing={3}\n        sx={{\n          alignItems: "center",'
        )
    ],
    "src/sections/home/_components/HomeCommunity.tsx": [
        (
            '        <Stack spacing={2} textAlign="center" sx={{ zIndex: 9 }}>',
            '        <Stack spacing={2} sx={{ zIndex: 9, textAlign: "center" }}>'
        ),
        (
            '            <Stack\n              direction="row"\n              spacing={1}\n              alignItems="center"\n              sx={{ zIndex: 9 }}',
            '            <Stack\n              direction="row"\n              spacing={1}\n              sx={{ zIndex: 9, alignItems: "center" }}'
        ),
        (
            '          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ zIndex: 9 }}>',
            '          <Stack direction="row" spacing={2} sx={{ zIndex: 9, flexWrap: "wrap" }}>'
        ),
        (
            '              justifyContent="center"\n              sx={{\n                px: { xs: 2, md: 5 },\n                py: 2,\n                borderRadius: 2,\n                bgcolor: alpha(theme.palette.grey[900], 0.6),\n                border: `1px solid ${alpha(theme.palette.grey[800], 0.4)}`,\n              }}',
            '              sx={{\n                justifyContent: "center",\n                px: { xs: 2, md: 5 },\n                py: 2,\n                borderRadius: 2,\n                bgcolor: alpha(theme.palette.grey[900], 0.6),\n                border: `1px solid ${alpha(theme.palette.grey[800], 0.4)}`,\n              }}'
        ),
        (
            '            direction={{ xs: \'column\', sm: \'row\' }}\n            alignItems={{ xs: \'center\', sm: \'flex-start\' }}\n            spacing={3}\n            sx={{ mt: { xs: 5, md: 10 } }}',
            '            direction={{ xs: \'column\', sm: \'row\' }}\n            spacing={3}\n            sx={{ mt: { xs: 5, md: 10 }, alignItems: { xs: \'center\', sm: \'flex-start\' } }}'
        )
    ],
    "src/sections/home/_components/HomeCountdownDialog.tsx": [
        (
            '      PaperProps={{\n        sx: {',
            '      slotProps={{\n        paper: {\n          sx: {'
        ),
        (
            '      onClose={onClose}\n    >',
            '      onClose={onClose}\n      }\n    }}>'
        ),
        (
            '            direction="row"\n            alignItems="center"\n            justifyContent="space-between"\n            spacing={3}\n            sx={{ mb: 4 }}',
            '            direction="row"\n            spacing={3}\n            sx={{ mb: 4, alignItems: "center", justifyContent: "space-between" }}'
        ),
        (
            '              <Stack direction="row" alignItems="center" spacing={1}>',
            '              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>'
        ),
        (
            '            direction="row"\n            justifyContent="center"\n            spacing={3}\n            sx={{ mb: 6 }}',
            '            direction="row"\n            spacing={3}\n            sx={{ mb: 6, justifyContent: "center" }}'
        ),
        (
            '            direction="row"\n            alignItems="center"\n            justifyContent="space-between"\n            spacing={2}\n            sx={{ mb: 4 }}',
            '            direction="row"\n            spacing={2}\n            sx={{ mb: 4, alignItems: "center", justifyContent: "space-between" }}'
        ),
        (
            '            direction="row"\n            justifyContent="center"\n            spacing={2}\n            sx={{ mb: 5 }}',
            '            direction="row"\n            spacing={2}\n            sx={{ mb: 5, justifyContent: "center" }}'
        ),
        (
            '            spacing={1}\n            alignItems="center"\n            sx={{\n              position: \'relative\',',
            '            spacing={1}\n            sx={{\n              alignItems: "center",\n              position: \'relative\','
        )
    ],
    "src/sections/home/_components/HomeEcosystem.tsx": [
        (
            '          direction={{ xs: \'column\', md: \'row\' }}\n          alignItems={{ md: \'flex-end\' }}\n          justifyContent="space-between"\n          sx={{ mb: 8, gap: 3 }}',
            '          direction={{ xs: \'column\', md: \'row\' }}\n          sx={{ mb: 8, gap: 3, alignItems: { md: \'flex-end\' }, justifyContent: "space-between" }}'
        )
    ],
    "src/sections/home/_components/HomeHero.tsx": [
        (
            '              direction={{ xs: \'column\', sm: \'row\' }}\n              justifyContent={{ xs: \'center\', md: \'flex-start\' }}\n              spacing={2}\n              sx={{ mt: 5 }}',
            '              direction={{ xs: \'column\', sm: \'row\' }}\n              spacing={2}\n              sx={{ mt: 5, justifyContent: { xs: \'center\', md: \'flex-start\' } }}'
        ),
        (
            '          direction={{ xs: \'column\', md: \'row\' }}\n          alignItems="center"\n          justifyContent="space-between"\n          spacing={{ xs: 3, md: 5 }}',
            '          direction={{ xs: \'column\', md: \'row\' }}\n          spacing={{ xs: 3, md: 5 }}\n          sx={{ alignItems: "center", justifyContent: "space-between" }}'
        )
    ],
    "src/sections/home/_components/HomeHeroSvg.tsx": [
        (
            '          direction="row"\n          alignItems="center"\n          spacing={2}\n          sx={{',
            '          direction="row"\n          spacing={2}\n          sx={{\n            alignItems: "center",'
        )
    ],
    "src/sections/home/_components/HomeIntegrations.tsx": [
        (
            '            direction={{ xs: \'column\', md: \'row\' }}\n            justifyContent="center"\n            alignItems={{ xs: \'center\', md: \'flex-start\' }}\n            spacing={4}\n            sx={{ width: \'100%\' }}',
            '            direction={{ xs: \'column\', md: \'row\' }}\n            spacing={4}\n            sx={{ width: \'100%\', justifyContent: "center", alignItems: { xs: \'center\', md: \'flex-start\' } }}'
        ),
        (
            '            direction={{ xs: \'column\', md: \'row\' }}\n            justifyContent="center"\n            alignItems={{ xs: \'center\', md: \'flex-start\' }}\n            spacing={4}\n            sx={{ width: \'100%\', mt: { xs: 4, md: \'auto\' } }}',
            '            direction={{ xs: \'column\', md: \'row\' }}\n            spacing={4}\n            sx={{ width: \'100%\', mt: { xs: 4, md: \'auto\' }, justifyContent: "center", alignItems: { xs: \'center\', md: \'flex-start\' } }}'
        ),
        (
            '          spacing={2}\n          alignItems="center"\n          sx={{ textAlign: \'center\', px: 2 }}',
            '          spacing={2}\n          sx={{ textAlign: \'center\', px: 2, alignItems: "center" }}'
        ),
        (
            '          direction="row"\n          justifyContent="space-between"\n          alignItems="center"\n          sx={{ mb: 2 }}',
            '          direction="row"\n          sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}'
        ),
        (
            '      direction="row"\n      justifyContent="space-between"\n      sx={{\n        borderBottom: `1px solid ${alpha(theme.palette.grey[800], 0.3)}`,\n        pb: 1.5,\n      }}',
            '      direction="row"\n      sx={{\n        justifyContent: "space-between",\n        borderBottom: `1px solid ${alpha(theme.palette.grey[800], 0.3)}`,\n        pb: 1.5,\n      }}'
        )
    ],
    "src/sections/home/_components/HomeLatestNews.tsx": [
        (
            '          direction={{ xs: \'column\', md: \'row\' }}\n          alignItems={{ md: \'flex-end\' }}\n          justifyContent="space-between"\n          sx={{ mb: 6, gap: 3 }}',
            '          direction={{ xs: \'column\', md: \'row\' }}\n          sx={{ mb: 6, gap: 3, alignItems: { md: \'flex-end\' }, justifyContent: "space-between" }}'
        )
    ],
    "src/sections/home/_components/HomeRoadmap.tsx": [
        (
            '          container\n          display="grid"\n          gridTemplateColumns={{ xs: \'repeat(1, 1fr)\', md: \'repeat(4, 1fr)\' }}\n          rowGap={{ xs: 4, md: 0 }}\n          columnGap={3}\n          sx={{ mt: { xs: 5, md: 10 } }}',
            '          container\n          sx={{\n            display: "grid",\n            gridTemplateColumns: { xs: \'repeat(1, 1fr)\', md: \'repeat(4, 1fr)\' },\n            rowGap: { xs: 4, md: 0 },\n            columnGap: 3,\n            mt: { xs: 5, md: 10 }\n          }}'
        ),
        (
            '                  gridColumn={{ xs: \'1 / -1\', md: isEven ? \'1 / 2\' : \'3 / 4\' }}\n                  gridRow={{ md: rowIndex }}\n                  sx={{ textAlign: { xs: \'center\', md: isEven ? \'right\' : \'left\' } }}',
            '                  sx={{\n                    gridColumn: { xs: \'1 / -1\', md: isEven ? \'1 / 2\' : \'3 / 4\' },\n                    gridRow: { md: rowIndex },\n                    textAlign: { xs: \'center\', md: isEven ? \'right\' : \'left\' }\n                  }}'
        )
    ],
    "src/sections/home/_components/HomeTeam.tsx": [
        (
            '          direction={{ xs: \'column\', md: \'row\' }}\n          alignItems={{ md: \'flex-end\' }}\n          justifyContent="space-between"\n          sx={{ mb: 8, gap: 3 }}',
            '          direction={{ xs: \'column\', md: \'row\' }}\n          sx={{ mb: 8, gap: 3, alignItems: { md: \'flex-end\' }, justifyContent: "space-between" }}'
        )
    ],
    "src/sections/team/_view/TeamView.tsx": [
        (
            '            direction="row"\n            spacing={1}\n            justifyContent="center"',
            '            direction="row"\n            spacing={1}\n            sx={{ justifyContent: "center" }}'
        )
    ],
    "src/theme/core/components/card.tsx": [
        (
            '      titleTypographyProps: { typography: \'h6\' },\n      subheaderTypographyProps: { typography: \'body2\' },',
            '      slotProps: {\n        title: { typography: \'h6\' },\n        subheader: { typography: \'body2\' }\n      },'
        )
    ],
    "src/theme/core/components/list.tsx": [
        (
            '    defaultProps: {\n      primaryTypographyProps: {\n        typography: \'subtitle2\',\n      },\n      secondaryTypographyProps: {\n        component: \'span\',\n      },\n    },',
            '    defaultProps: {\n      slotProps: {\n        primary: {\n          typography: \'subtitle2\',\n        },\n        secondary: {\n          component: \'span\',\n        },\n      },\n    },'
        )
    ],
    "src/theme/core/components/table.tsx": [
        (
            '      backIconButtonProps: {\n        size: \'small\',\n      },\n      nextIconButtonProps: {\n        size: \'small\',\n      },',
            '      slotProps: {\n        actions: {\n          previousButton: {\n            size: \'small\',\n          },\n          nextButton: {\n            size: \'small\',\n          },\n        }\n      },'
        )
    ]
}

import time
successes = 0

for filepath, file_fixes in fixes.items():
    full_path = os.path.join("frontend", filepath)
    if not os.path.exists(full_path):
        print(f"File not found: {filepath}")
        continue
        
    with open(full_path, "r") as f:
        content = f.read()
        
    original = content
    for old, new in file_fixes:
        if old in content:
            content = content.replace(old, new)
        else:
            print(f"Could not find exact string in {filepath}:\n{old}")
            # Try a fuzzy find in case of windows line endings or minor spacing
            old_no_space = "".join(old.split())
            cont_no_space = "".join(content.split())
            if old_no_space in cont_no_space:
                print(" -> It exists but spacing differs.")
            
    if original != content:
        with open(full_path, "w") as f:
            f.write(content)
        print(f"Updated {filepath}")
        successes += 1

print(f"Successfully updated {successes} files.")
